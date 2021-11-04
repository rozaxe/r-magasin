import { Observable } from "./Observable";
import { Observer } from "./Observer";
import { Subscription } from "./Subscription";

export class Store<T> implements Observable<T> {
  constructor(private _value: T) {}

  public get value() {
    return this._value;
  }

  private set value(value: T) {
    this._value = value;
  }

  private observers: Set<Observer<T>> = new Set();

  subscribe = (callback: (value: T) => void): Subscription => {
    const observer = new Observer(callback, (self) => {
      this.unsubscribe(self);
    });
    this.observers.add(observer);
    observer.notify(this.value);
    return observer;
  };

  protected setValue = (value: T) => {
    if (this.value === value) return;
    this.value = value;
    this.observers.forEach((observer) => {
      observer.notify(this.value);
    });
  };

  private unsubscribe = (observer: Observer<T>) => {
    this.observers.delete(observer);
  };
}
