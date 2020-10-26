import { Queue } from "./queue";
import { Thread } from "./thread";

export class RrQueuesCollection<T extends Thread>  {
    private _ready: Queue<T>;
    private _aux: Queue<T>;
    private _inProcess: T;
    private _inIoProcess: T;
    private _io: Queue<T>;
    private _finish: Queue<T>;

    private _quantum: number;
    private _step: number = 0;
    private _processTime: number;
    private _ioProcessTime: number;

    constructor(quantum: number, newParam: Queue<T> = [], readyParam: Queue<T> = [], ioParam: Queue<T> = [], finishParam: Queue<T> = []) {
        this._processTime = this._quantum;
        this._quantum = quantum;
        this._ready = readyParam;
        this._aux = new Queue<T>();
        this._inProcess = null;
        this._inIoProcess = null;
        this._io = ioParam;
        this._finish = finishParam;
    }

    public getStep(): number {
        return this._step;
    }

    public stepUp(amount?: number) {
        this._step = amount ? this._step + amount : this._step + 1;
    }

    public pushNewProcesses(...item: T[]): void {
        this._ready.push(...item);
    }

    public pushToInProcess(): void {
        this._inProcess = this._aux.length > 0
            ? this._aux.shift()
            : this._ready.shift();
        const timeRest = this._inProcess.getCloselyCpuTime();
        this._processTime = timeRest > this._quantum ? this._quantum : timeRest;
    }

    public pushToIoQueue(): void {
        if (!this._inIoProcess) {
            this.pushToInIoProcess(this._inProcess);
        } else {
            this._io.push(this._inProcess);
        }
    }

    private pushToInIoProcess(item: T): void {
        this._inIoProcess = item;
        this._ioProcessTime = this._inIoProcess.getCloselyIoTime();
    }

    public finishProcess(): void {
        if (this._inProcess.hasIoTime()) {
            this.pushToIoQueue();
        } else if (this._inProcess.hasCpuTime()) {
            this._aux.push(this._inProcess);
        } else {
            this._finish.push(this._inProcess);
        }
        this._inProcess = null;
        this._processTime = this._quantum;
    }

    public finishIoProcess(): void {
        this._aux.push(this._inIoProcess);
        this._inIoProcess = null;
    }

    public hasInProcess() {
        return this._inProcess;
    }

    public execProcessQueue() {
        const idProcessed = this._inProcess?.getId();
        if (this._inProcess) {
            this._processTime--;
            this._inProcess.subtractCpuTime();
            if (this.processDone()) {
                this.finishProcess();
            }
        }
        return idProcessed;
    }

    public execIoQueue(): number {
        let idIoProcess: number;
        if (this._inIoProcess) {
            this._ioProcessTime--;
            this._inIoProcess.subtractIoTime();
            idIoProcess = this._inIoProcess?.getId();
            if (this.ioProcessDone()) {
                this.finishIoProcess();
            }
        } else {
            if (this._io.length) {
                this.pushToInIoProcess(this._io.shift());
                this._ioProcessTime--;
                this._inIoProcess.subtractIoTime();
                idIoProcess = this._inIoProcess?.getId();
                if (this.ioProcessDone()) {
                    this.finishIoProcess();
                }
            }
        }
        return idIoProcess;
    }

    public processDone(): boolean {
        return this._processTime <= 0;
    }

    public ioProcessDone(): boolean {
        return this._ioProcessTime <= 0;
    }

    /** GETTERS AND SETTERS */
    public getReady(): Queue<T> {
        return this._ready;
    }

    public setReady(collection: Queue<T>): void {
        this._ready = collection;
    }

    public getAux(): Queue<T> {
        return this._aux;
    }

    public setAux(collection: Queue<T>): void {
        this._aux = collection;
    }

    public getInProcess(): T {
        return this._inProcess;
    }

    public setInProcess(item: T): void {
        this._inProcess = item;
    }

    public getInIoProcess(): T {
        return this._inIoProcess;
    }

    public setInIoProcess(item: T): void {
        this._inIoProcess = item;
    }

    public getIO(): Queue<T> {
        return this._io;
    }

    public setIO(collection: Queue<T>): void {
        this._io = collection;
    }

    public getFinish(): Queue<T> {
        return this._finish;
    }

    public setFinish(collection: Queue<T>): void {
        this._finish = collection;
    }

    public queuesProcessed(): boolean {
        return !this.getReady().length
            && !this.getAux().length
            && !this.getInProcess()
            && !this.getInIoProcess()
            && !this.getIO().length
            && this.getFinish().length > 0;
    }
}
