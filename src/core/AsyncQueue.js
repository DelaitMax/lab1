export class AsyncQueue {
  #items = [];
  #waiters = [];

  enqueue(item) {
    const waiter = this.#waiters.shift();
    if (waiter) waiter(item);
    else this.#items.push(item);
  }

  dequeue() {
    if (this.#items.length) return Promise.resolve(this.#items.shift());
    return new Promise((resolve) => this.#waiters.push(resolve));
  }

  get size() {
    return this.#items.length;
  }

  toArray() {
    return [...this.#items];
  }
}
