export class Thread {

    private _pid: number;
    private _name: string;
    private _cpuTime: number[];
    private _ioTime: number[];

    constructor(id: number, name: string = 'Thread #', cpuTime: number[] = [], ioTime: number[] = []) {
        this._pid = id;
        this._name = name;
        this._cpuTime = cpuTime;
        this._ioTime = ioTime;
    }

    /** GETTERS AND SETTERS */
    getPid(): number {
        return this._pid;
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

    /**
    * Get the rest of CPU Frames to execute
    */
    getCloselyCpuTime(): number {
        const idx = this._cpuTime.findIndex(time => time);
        if (idx >= 0)
            return this._cpuTime[idx];

        return null;
    }

    /**
     * Get the rest of I/O Frames to execute
     */
    getCloselyIoTime(): number {
        const idx = this._ioTime.findIndex(time => time);
        if (idx >= 0)
            return this._ioTime[idx];

        return null;
    }

    /**
     * Check if has I/O frames to execute
     */
    hasIoTime(): boolean {
        return this._ioTime.findIndex(time => time) >= 0;
    }

    /**
     * Substrat in one the left process time on the closest queue CPU Time
     */
    subtractCpuTime(): void {
        const idx = this._cpuTime.findIndex(time => time);
        if (idx >= 0)
            this._cpuTime[idx]--;
        return null;
    }

    /**
     * Substrat in one the left process time on the closest I/O CPU Time
     */
    subtractIoTime(): void {
        const idx = this._ioTime.findIndex(time => time);
        if (idx >= 0)
            this._ioTime[idx]--;
        return null;
    }
}
