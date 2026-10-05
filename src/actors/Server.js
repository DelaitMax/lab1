import { sleep } from "../core/sleep.js";

const ANNOUNCE_MS = 800;

export class Server {
  constructor({ serviceQueue, state, onChange }) {
    Object.assign(this, { serviceQueue, state, onChange });
  }

  async run(isActive) {
    while (isActive()) {
      const order = await this.serviceQueue.dequeue();
      await order.prepared;
      if (!isActive()) return;

      this.state.pickup = order.number;
      order.markServed();
      this.onChange();

      await sleep(ANNOUNCE_MS);
    }
  }
}
