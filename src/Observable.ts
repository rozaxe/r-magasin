import { Subscribable } from './Subscribable';

export interface Observable<T> extends Subscribable<T> {
  value: T;
}
