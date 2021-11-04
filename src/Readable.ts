import { DisposedError } from "./DisposedError";
import { Disposable } from "./Disposable";
import { Store } from "./Store";

/**
 * A reactive value that allows to update its value by an internal function and notify its observers.
 * @class Readable
 */
export class Readable<T> extends Store<T> implements Disposable {
  private disposed = false;
  private cleanup: (() => void) | undefined;

  /**
   *
   * @param start Function the internal function that allows to set its value.
   *                       It can return a cleanup function called when the store is disposed.
   * @param initialValue the initial value of the store.
   */
  constructor(
    start: (
      setter: (value: T) => void,
      getValue: () => T
    ) => (() => void) | void,
    initialValue: T
  ) {
    super(initialValue);
    this.cleanup = start(this.guardedSetValue, this.getValue) as any;
  }

  /**
   * Dispose the reactive store by calling the cleanup callback. It will then be unable to update its value.
   */
  dispose = () => {
    if (this.disposed) throw new DisposedError();
    this.disposed = true;
    if (this.cleanup != undefined) {
      this.cleanup();
    }
  };

  private getValue = () => {
    return this.value;
  };

  private guardedSetValue = (value: T) => {
    if (this.disposed) throw new DisposedError();
    this.setValue(value);
  };
}
