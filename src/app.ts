import { ProcessSymbolEnum } from "./enum/process-symbol.enum";
import { RrQueuesCollection } from "./classes/rr-queue-collection";
import { Thread } from "./classes/thread";
import { ShowMtxFormat } from "./view/show-mtx";

const quantum: number = 3;

const queues: RrQueuesCollection<Thread> = new RrQueuesCollection<Thread>(quantum);

const thread1: Thread = new Thread(1, "Thread #1", [3, 2], [4]);

queues.pushNewProcesses(thread1);

const mtx = [];

for (let i = 0; i < 4; i++) {
    mtx.push([]);
}

const mtxFormat: ShowMtxFormat = new ShowMtxFormat(mtx);

const insertThreads = (queues: RrQueuesCollection<Thread>, step: number) => {
    if (step == 1) {
        const thread2: Thread = new Thread(2, "Thread #2", [1, 3], [1]);
        queues.pushNewProcesses(thread2)
    }
    if (step == 2) {
        const thread3: Thread = new Thread(3, "Thread #3", [2, 3], [1]);
        queues.pushNewProcesses(thread3)
    }
    if (step == 3) {
        const thread4: Thread = new Thread(4, "Thread #4", [6, 4], [1]);
        queues.pushNewProcesses(thread4)
    }
}

try {
    while (!queues.queuesProcessed()) {
        const step = queues.getStep();
        insertThreads(queues, step);

        if (!queues.hasInProcess())
            queues.pushToInProcess();

        const idIo: number = queues.execIoQueue();
        const idPorcess: number = queues.execProcessQueue();

        if (idPorcess)
            mtx[idPorcess - 1][step] = ProcessSymbolEnum.exec;
        if (idIo)
            mtx[idIo - 1][step] = ProcessSymbolEnum.io;

        queues.stepUp();
    }
} catch (error) {
    console.log(error);
}

mtxFormat.print();