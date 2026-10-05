export class Emitter {
  #handlers = new Set();

  subscribe(fn) {
    this.#handlers.add(fn);
    return () => this.#handlers.delete(fn);
  }

  emit(data) {
    this.#handlers.forEach((fn) => fn(data));
  }
}
