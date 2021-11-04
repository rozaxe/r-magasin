import { Subscription } from './Subscription';

export class Observer<T> implements Subscription {
  constructor(
    private onValue: (value: T) => void,
    private onUnsubscribe: (self: Observer<T>) => void
  ) {}

  notify = (value: T) => {
    this.onValue(value);
  };

  unsubscribe = () => {
    this.onUnsubscribe(this);
  };
}
