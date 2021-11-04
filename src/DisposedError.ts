export class DisposedError extends Error {
  constructor() {
    super("This store has been disposed.");
    this.name = "DisposedError";
  }
}
