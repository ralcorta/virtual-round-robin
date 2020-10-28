import { ProcessSymbolEnum } from "./src/enum/process-symbol.enum";
import { RrQueuesManager } from "./src/classes/rr-queue-manager";
import { Thread } from "./src/classes/thread";
import { ShowMtxFormat } from "./src/view/show-mtx";
import { QueueInjector } from "./src/classes/queue-injector";
import { ThreadTimed } from "./src/classes/thread-timed";
import { PresentationManager } from "./src/classes/presentation-manager";

/** 
 * Set the quantum for the RR Algotithm 
 */
const quantum: number = 3;

/**
 * Instance a Queue Collection manager
 */
const queues: RrQueuesManager<Thread> = new RrQueuesManager<Thread>(quantum);

/**
 * Instance the diferents therads where the RR needs to work
 */

const thread1: Thread = new Thread(5325, "Thread #1", [3, 2], [4]);
const thread2: Thread = new Thread(1256, "Thread #2", [1, 3], [1]);
const thread3: Thread = new Thread(4365, "Thread #3", [2, 3], [1]);
const thread4: Thread = new Thread(4683, "Thread #4", [6, 4], [1]);

/**
 * Generate the array for thread insertion by arrival time
 */
const threads: Array<ThreadTimed> = [
    new ThreadTimed(0, thread1),
    new ThreadTimed(1, thread2),
    new ThreadTimed(2, thread3),
    new ThreadTimed(3, thread4),
]

/**
 * Execute the algorithm
 */
const mtxFormat: ShowMtxFormat = queues.exec(threads);

/**
 * Clear the console from another compilation
 */
console.clear();

/**
 * Make the formal presentation
 */
PresentationManager.printPresentation();

/**
 * Print the final gant
 */
mtxFormat.print();