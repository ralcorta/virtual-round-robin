import { Thread } from "./thread";

export class ThreadTimed {

    public readonly moment: number;
    public readonly thread: Thread;

    constructor(moment: number, thread: Thread) {
        this.moment = moment;
        this.thread = thread;
    }
}
