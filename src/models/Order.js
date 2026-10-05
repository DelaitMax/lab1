export class Order {
  constructor(number) {
    this.number = number;
    this.prepared = new Promise((resolve) => (this.markPrepared = resolve));
    this.served = new Promise((resolve) => (this.markServed = resolve));
  }
}
