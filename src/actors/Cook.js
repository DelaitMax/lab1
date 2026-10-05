import { sleep } from "../core/sleep.js";

export class Cook {
  constructor({ id, kitchenQueue, serviceQueue, timeMs, state, onChange }) {
    Object.assign(this, { id, kitchenQueue, serviceQueue, timeMs, state, onChange });
  }

  async run(isActive) {
    while (isActive()) {
      const order = await this.kitchenQueue.dequeue();
      if (!isActive()) return;

      this.state.cooks.set(this.id, order.number);
      this.onChange();

      await sleep(this.timeMs);
      if (!isActive()) return;

      order.markPrepared();
      this.serviceQueue.enqueue(order);
      this.state.cooks.set(this.id, null);
      this.onChange();
    }
  }
}
