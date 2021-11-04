import { Subscription } from "./Subscription";

export interface Subscribable<T> {
  subscribe(callback: (value: T) => void): Subscription;
}
