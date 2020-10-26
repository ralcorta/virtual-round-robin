export class ShowMtxFormat {
    private _mtx: [][];
    private _blank: string;
    constructor(mtx: [][], blankSpace?: string) {
        this._mtx = mtx;
        this._blank = blankSpace ?? "_";
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
        console.clear();
        const mtx = this.sanitization();
        for (let i = 0; i < this._mtx.length; i++) {
            console.log(...mtx[i])
        }
    }
}