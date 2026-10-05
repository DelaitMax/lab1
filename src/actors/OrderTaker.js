import { Order } from "../models/Order.js";
import { sleep } from "../core/sleep.js";

export class OrderTaker {
  constructor({ id, orderLine, kitchenQueue, servingLine, timeMs, orderNumbers, state, onChange }) {
    Object.assign(this, { id, orderLine, kitchenQueue, servingLine, timeMs, orderNumbers, state, onChange });
  }

  async run(isActive) {
    while (isActive()) {
      const customer = await this.orderLine.dequeue();
      if (!isActive()) return;

      const order = new Order(this.orderNumbers.next());
      this.state.cashiers.set(this.id, order.number);
      this.onChange();

      await sleep(this.timeMs);
      if (!isActive()) return;

      customer.order = order;
      this.kitchenQueue.enqueue(order);
      this.servingLine.add(customer);
      this.state.cashiers.set(this.id, null);
      this.onChange();

      order.served.then(() => {
        this.servingLine.delete(customer);
        this.onChange();
      });
    }
  }
}
