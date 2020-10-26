export class Queue<T> extends Array<T> {
    constructor(items: Array<T> = []) {
        super(...items);
    }
    static create<T>(): Queue<T> {
        return Object.create(Queue.prototype);
    }
}
