import { RrQueuesManager } from "./rr-queue-manager";
import { Thread } from "./thread";
import { ThreadTimed } from "./thread-timed";

export class QueueInjector {
    public static checkThreadsToInsert(queues: RrQueuesManager<Thread>, threads: Array<ThreadTimed>) {
        const step = queues.getStep();
        const thread: ThreadTimed = threads.find(t => t.moment == step);
        if (thread) {
            queues.insertProcessToReadyQueue(thread.thread)
        }
    }
}