import { ProcessSymbolEnum } from "../enum/process-symbol.enum";
import { ShowMtxFormat } from "../view/show-mtx";
import { Queue } from "./queue";
import { QueueInjector } from "./queue-injector";
import { Thread } from "./thread";
import { ThreadTimed } from "./thread-timed";

export class RrQueuesManager<T extends Thread>  {
    /** QUEUES */

    /**
     * Ready queue: Where process wait for be processed
     */
    private _ready: Queue<T>;

    /**
     * Aux queue: Queue where a process is deposited after was processed by I/O queue
     */
    private _aux: Queue<T>;

    /**
     * I/O queue: Queue where a process is deposited after was in "inProcess" state and have Frames to be resolve
     */
    private _io: Queue<T>;

    /**
     * Finish queue: Where process end
     */
    private _finish: Queue<T>;

    /** THREADS PROCESSED */

    /**
     * InProcess: A process on exec
     */
    private _inProcess: T;

    /**
     * InIOProcess: Where a process with I/O frame is shipped
     */
    private _inIoProcess: T;

    /** COUNTERS */

    /**
     * Quantum: Units of time that CPU take for process something
     */
    private _quantum: number;

    /**
     * Step: Auxiliar for make more readable the process
     */
    private _step: number = 0;

    /**
     * Process Time: Time left for the process to finish its burst
     */
    private _processTime: number;

    /**
     * IOProcessTime: Time left for the process I/O frame to finish its burst
     */
    private _ioProcessTime: number;

    constructor(quantum: number, readyParam: Queue<T> = [], ioParam: Queue<T> = [], finishParam: Queue<T> = []) {
        this._processTime = this._quantum;
        this._quantum = quantum;
        this._ready = readyParam;
        this._aux = new Queue<T>();
        this._inProcess = null;
        this._inIoProcess = null;
        this._io = ioParam;
        this._finish = finishParam;
    }

    /**
     * Execute the algorithm processing the queues
     * @param threads
     */
    public exec(threads: Array<ThreadTimed>): ShowMtxFormat {
        const mtxFormat: ShowMtxFormat = new ShowMtxFormat();
        mtxFormat.initialize(threads.length);

        try {
            while (!this.queuesProcessed()) {
                QueueInjector.checkThreadsToInsert(this, threads);
                const step = this.getStep();

                if (!this.hasInProcess())
                    this.pushToInProcess();

                const idIo: number = this.execIoQueue();
                const idPorcess: number = this.execProcessQueue();

                mtxFormat.insertStringOnProcessPos(idPorcess, step, ProcessSymbolEnum.exec);
                mtxFormat.insertStringOnProcessPos(idIo, step, ProcessSymbolEnum.io);

                this.stepUp();
            }
        } catch (error) {
            console.log(error);
        }

        return mtxFormat;
    }

    /**
     * Get actual step of processor
     */
    public getStep(): number {
        return this._step;
    }

    /**
     * Upgrade the step
     * @param amount 
     */
    public stepUp(amount?: number) {
        this._step = amount ? this._step + amount : this._step + 1;
    }

    /**
     * Insert new process or threads to ready queue
     * @param item 
     */
    public insertProcessToReadyQueue(...item: T[]): void {
        this._ready.push(...item);
    }

    /**
     * Set process to be processed
     */
    public pushToInProcess(): void {
        this._inProcess = this._aux.length > 0
            ? this._aux.shift()
            : this._ready.shift();

        const timeRest = this._inProcess.getCloselyCpuTime();
        this._processTime = timeRest > this._quantum ? this._quantum : timeRest;
    }

    /**
     * Push the process to a I/O Queue
     */
    public pushToIoQueue(): void {
        if (!this._inIoProcess) {
            this.pushToInIoProcess(this._inProcess);
        } else {
            this._io.push(this._inProcess);
        }
    }

    /**
     * Set process to be used on I/O
     * @param item 
     */
    private pushToInIoProcess(item: T): void {
        this._inIoProcess = item;
        this._ioProcessTime = this._inIoProcess.getCloselyIoTime();
    }

    /**
     * End process and send to respective queue, removing actual process
     */
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

    /**
     * End process on I/O to be sent to AUX queue
     */
    public finishIoProcess(): void {
        this._aux.push(this._inIoProcess);
        this._inIoProcess = null;
    }

    /**
     * Check if a process is under processing
     */
    public hasInProcess() {
        return this._inProcess;
    }

    /**
     * Processing normal queues, using a CPU time with a specific quantum.
     */
    public execProcessQueue() {
        const idProcessed = this._inProcess?.getPid();
        if (this._inProcess) {
            this._processTime--;
            this._inProcess.subtractCpuTime();
            if (this.processDone()) {
                this.finishProcess();
            }
        }
        return idProcessed;
    }

    /**
     * Processing IO queue, using a CPU time.
     */
    public execIoQueue(): number {
        let idIoProcess: number;
        if (this._inIoProcess) {
            this._ioProcessTime--;
            this._inIoProcess.subtractIoTime();
            idIoProcess = this._inIoProcess?.getPid();
            if (this.ioProcessDone()) {
                this.finishIoProcess();
            }
        } else {
            if (this._io.length) {
                this.pushToInIoProcess(this._io.shift());
                this._ioProcessTime--;
                this._inIoProcess.subtractIoTime();
                idIoProcess = this._inIoProcess?.getPid();
                if (this.ioProcessDone()) {
                    this.finishIoProcess();
                }
            }
        }
        return idIoProcess;
    }

    /**
     * Check if a process id done
     */
    public processDone(): boolean {
        return this._processTime <= 0;
    }

    /**
     * Check if queues are empty to finish the algorithm
     */
    public queuesProcessed(): boolean {
        return !this.getReady().length
            && !this.getAux().length
            && !this.getInProcess()
            && !this.getInIoProcess()
            && !this.getIO().length
            && this.getFinish().length > 0;
    }

    /**
     * Check if a I/O frame is done
     */
    public ioProcessDone(): boolean {
        return this._ioProcessTime <= 0;
    }

    /**
     * GENERAL GETTERS AND SETTERS
     */

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

}
