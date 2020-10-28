import { ThreadTimed } from "../classes/thread-timed";
import { ProcessSymbolEnum } from "../enum/process-symbol.enum";

export class ShowMtxFormat {
    private _mtx: Array<string[]>;
    private _threads: Array<ThreadTimed>;
    private _blank: string;

    constructor(mtx?: Array<string[]>, blankSpace?: string) {
        this._mtx = mtx ?? new Array<string[]>();
        this._blank = blankSpace ?? ProcessSymbolEnum.empty;
    }

    private sanitization(): Array<string[]> {
        const mtx: Array<string[]> = [];
        for (let i = 0; i < this._mtx.length; i++) {
            const arr: string[] = [];
            mtx[i] = arr;
            for (let j = 0; j < this._mtx[i].length; j++) {
                mtx[i][j] = this._mtx[i][j] ? this._mtx[i][j] : this._blank;
            }
        }

        const bigArraySize = mtx.reduce((prev, curr) => curr.length > prev.length ? curr : prev).length;

        for (let i = 0; i < mtx.length; i++) {
            for (let j = 0; j < bigArraySize; j++) {
                mtx[i][j] = mtx[i][j] ? mtx[i][j] : this._blank;
            }
        }

        return mtx;
    }

    public print(): void {
        const mtx = this.sanitization();
        const table = [];
        for (let i = 0; i < this._threads.length; i++) {
            table.push({
                "Process #": this._threads[i].thread.getPid(),
                ...this._mtx[i],
            });
        }
        console.table(table);
    }

    public insertStringOnProcessPos(processPos: number, step: number, word: string): void {
        if (processPos > -1)
            this._mtx[processPos][step] = word;
    }

    public initialize(threads: Array<ThreadTimed>): void {
        this._threads = threads;
        for (let i = 0; i < threads.length; i++) {
            this._mtx.push([]);
        }
    }
}