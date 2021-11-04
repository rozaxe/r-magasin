import { Store } from "./Store";

/**
 * A reactive value that allows to update its value and notify its observers.
 * @class Writable
 */
export class Writable<T> extends Store<T> {
  /**
   *
   * @param value T the new value to set
   */
  set = (value: T) => {
    this.setValue(value);
  };

  /**
   *
   * @param fn Function a mapping function that takes the current value and return the new value to set
   */
  update = (fn: (value: T) => T) => {
    this.setValue(fn(this.value));
  };
}
