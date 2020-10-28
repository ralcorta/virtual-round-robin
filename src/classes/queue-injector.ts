import { RrQueuesManager } from "./rr-queue-manager";
import { Thread } from "./thread";
import { ThreadTimed } from "./thread-timed";

export class QueueInjector {
    public static checkThreadsToInsert(queues: RrQueuesManager<Thread>) {
        const step = queues.getStep();
        const thread: ThreadTimed = queues.getThreadsTimed().find(t => t.moment == step);
        if (thread) {
            queues.insertProcessToReadyQueue(thread.thread)
        }
    }
}