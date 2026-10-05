import { AsyncQueue } from "./core/AsyncQueue.js";
import { Emitter } from "./core/Emitter.js";
import { CustomerGenerator } from "./actors/CustomerGenerator.js";
import { OrderTaker } from "./actors/OrderTaker.js";
import { Cook } from "./actors/Cook.js";
import { Server } from "./actors/Server.js";

function orderNumberSequence() {
  let n = 1;
  return { next: () => n++ };
}

export class Simulation {
  events = new Emitter();
  running = false;
  #generator = null;
  #runId = 0;

  start(config) {
    this.stop();
    this.running = true;
    const runId = ++this.#runId;
    const isActive = () => this.running && runId === this.#runId;

    const orderLine = new AsyncQueue();
    const kitchenQueue = new AsyncQueue();
    const serviceQueue = new AsyncQueue();
    const servingLine = new Set();
    const orderNumbers = orderNumberSequence();

    const state = {
      cashiers: new Map(config.cashiers.map((c) => [c.id, null])),
      cooks: new Map(config.cooks.map((c) => [c.id, null])),
      pickup: null,
    };

    this.queues = { orderLine, kitchenQueue, servingLine };
    this.state = state;
    this.config = config;

    const onChange = () => this.events.emit(this.snapshot());

    this.#generator = new CustomerGenerator({ orderLine, intervalMs: config.arrivalMs, onChange });
    this.#generator.start();

    for (const cashier of config.cashiers) {
      new OrderTaker({
        id: cashier.id,
        orderLine,
        kitchenQueue,
        servingLine,
        timeMs: cashier.timeMs,
        orderNumbers,
        state,
        onChange,
      }).run(isActive);
    }

    for (const cook of config.cooks) {
      new Cook({ id: cook.id, kitchenQueue, serviceQueue, timeMs: cook.timeMs, state, onChange }).run(isActive);
    }

    new Server({ serviceQueue, state, onChange }).run(isActive);

    onChange();
  }

  stop() {
    this.running = false;
    this.#generator?.stop();
    this.events.emit(this.snapshot());
  }

  snapshot() {
    if (!this.queues) {
      return {
        running: false,
        orderLine: 0,
        cashiers: [],
        kitchenWaiting: [],
        cooks: [],
        pickup: null,
        servingLine: [],
      };
    }
    const { orderLine, kitchenQueue, servingLine } = this.queues;
    return {
      running: this.running,
      orderLine: orderLine.size,
      cashiers: this.config.cashiers.map((c) => ({ id: c.id, taking: this.state.cashiers.get(c.id) })),
      kitchenWaiting: kitchenQueue.toArray().map((o) => o.number),
      cooks: this.config.cooks.map((c) => ({ id: c.id, cooking: this.state.cooks.get(c.id) })),
      pickup: this.state.pickup,
      servingLine: [...servingLine].map((c) => c.order.number),
    };
  }
}
