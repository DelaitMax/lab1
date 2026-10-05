export class CustomerGenerator {
  #timer = null;
  #nextId = 1;

  constructor({ orderLine, intervalMs, onChange }) {
    Object.assign(this, { orderLine, intervalMs, onChange });
  }

  start() {
    this.#timer = setInterval(() => {
      this.orderLine.enqueue({ id: this.#nextId++, order: null });
      this.onChange();
    }, this.intervalMs);
  }

  stop() {
    clearInterval(this.#timer);
  }
}
