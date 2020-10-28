import { ThreadTimed } from "../classes/thread-timed";
import { ProcessSymbolEnum } from "../enum/process-symbol.enum";

export class ShowMtxFormat {
    private _mtx: Array<string[]>;
    private _threads: Array<ThreadTimed>;

    constructor(mtx?: Array<string[]>, blankSpace?: string) {
        this._mtx = mtx ?? new Array<string[]>();
    }

    public print(): void {
        const table = [];
        for (let i = 0; i < this._threads.length; i++) {
            const row = { "Process #": this._threads[i].thread.getPid() };
            for (let j = 1; j <= this._mtx[i].length; j++) {
                if (this._mtx[i][j])
                    row[j] = this._mtx[i][j];
            }
            table.push(row);
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