import { ErrorThreadValidatorEnum } from "../enum/process-symbol.enum";
import { ThreadValidatorError } from "./exceptions";
import { Thread } from "./thread";
import { ThreadTimed } from "./thread-timed";

export class ThreadValidator {

    public static threadTimedListValidator(threadsTimed: Array<ThreadTimed>): boolean {
        if (!this.timeValidator(threadsTimed))
            throw this.thorwError(ErrorThreadValidatorEnum.timeValidator);

        const threads: Array<Thread> = threadsTimed.map(t => t.thread);

        if (!this.pidValidator(threads))
            throw this.thorwError(ErrorThreadValidatorEnum.pidValidator);

        if (!this.cpuNegativeValidator(threads))
            throw this.thorwError(ErrorThreadValidatorEnum.cpuNegativeValidator);

        return true;
    }

    public static timeValidator(threadsTimed: Array<ThreadTimed>): boolean {
        return !threadsTimed.some(t => t.moment < 0);
    }

    public static pidValidator(threads: Array<Thread>): boolean {
        return !(this.findDuplicates(threads).length > 0);
    }

    public static cpuNegativeValidator(threads: Array<Thread>): boolean {
        return !threads.some(t => !t.getCpuTime().length || t.getCpuTime().some(t => t < 0));
    }

    public static findDuplicates<T>(arr: Array<T>): Array<T> {
        return arr.filter((item, index) => arr.indexOf(item) != index);
    }

    private static thorwError(message: ErrorThreadValidatorEnum): Error {
        return new ThreadValidatorError(message);
    }
}