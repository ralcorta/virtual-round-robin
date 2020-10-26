export class Thread {
    private _id: number;
    private _name: string;
    private _cpuTime: number[];
    private _ioTime: number[];

    constructor(id: number, name: string = 'Thread #', cpuTime: number[] = [], ioTime: number[] = []) {
        this._id = id;
        this._name = name;
        this._cpuTime = cpuTime;
        this._ioTime = ioTime;
    }

    getId(): number {
        return this._id;
    }

    getName(): string {
        return this._name;
    }

    getCpuTime(): number[] {
        return this._cpuTime;
    }

    hasCpuTime(): boolean {
        return this._cpuTime.findIndex(time => time) >= 0;
    }

    getIoTime(): number[] {
        return this._ioTime;
    }

    getCloselyCpuTime(): number {
        const idx = this._cpuTime.findIndex(time => time);
        if (idx >= 0)
            return this._cpuTime[idx];

        return null;
    }


    getCloselyIoTime(): number {
        const idx = this._ioTime.findIndex(time => time);
        if (idx >= 0)
            return this._ioTime[idx];

        return null;
    }

    hasIoTime(): boolean {
        return this._ioTime.findIndex(time => time) >= 0;
    }

    subtractCpuTime(): void {
        const idx = this._cpuTime.findIndex(time => time);
        if (idx < 0)
            return null;
        // throw new Error("Without CPU time");

        this._cpuTime[idx]--;
    }

    subtractIoTime(): void {
        const idx = this._ioTime.findIndex(time => time);
        if (idx < 0)
            return null;
        // throw new Error("Without IO time");

        this._ioTime[idx]--;
    }
}
