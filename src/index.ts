import { Observable } from "./Observable";
import { Readable } from "./Readable";
import { Writable } from "./Writable";

/**
 * Function to create a reactive value that can been updated and notify its observers
 * @param initialValue the initial value of the store
 * @example
 * const count = writable(42)
 * count.subscribe((n) => console.log(n))
 * // => 42
 * count.set(51)
 * // => 51
 * count.update(x => x * 2)
 * // => 102
 * @returns Writable
 */
export function writable<T>(initialValue: T): Writable<T> {
  return new Writable(initialValue);
}

/**
 * Function to create a reactive value that updated its value by an internal function and notify its observers
 * @param start Function
 * @param initialValue the initial value of the store
 * @example
 * const clock = readable((set) => {
 *   const interval = setInterval(() => {
 *     set(Date.now())
 *   }, 1000)
 *   return () => clearInterval(interval)
 * }, Date.now())
 * clock.subscribe((n) => console.log(n))
 * // => will emit the current date every seconds
 * @returns Readable
 */
export function readable<T>(
  start: (set: (value: T) => void, getValue: () => T) => (() => void) | void,
  initialValue: T
): Readable<T> {
  return new Readable(start, initialValue);
}

type Observables =
  | Observable<any>
  | [Observable<any>, ...Array<Observable<any>>]
  | Array<Observable<any>>;

type ObservablesValues<T> = T extends Observable<infer U>
  ? U
  : { [K in keyof T]: T[K] extends Observable<infer U> ? U : never };

/**
 * Function to create a reactive value derived from one or many reactive value.
 * @param sources Array<Observable> the inputs to observe
 * @param fn Function the mapping function that takes input's value and return a derived value
 * @param initialValue the initial value of the store
 * @example
 * const times = writable(3)
 * const text = writable('na')
 * const message = derived([times, text], ([x, t]) => {
 *   return `Batman ${t.repeat(x)}`
 * })
 * message.subscribe((n) => console.log(n))
 * // => Batman nanana
 * times.set(5)
 * // => Batman nanananana
 * @example
 * const search = writable('boots')
 * const results = derived(search, (s, set) => {
 *   const controller = new AbortController()
 *   fetch(`/search?query=${s}`, { signal: controller.signal })
 *     .then(resp => resp.json())
 *     .then((items) => set(items))
 *   return () => controller.abort()
 * }, [])
 * @returns Readable
 */
export function derived<O extends Observables, T>(
  sources: O,
  fn: (
    values: ObservablesValues<O>,
    set: (value: T) => void
  ) => (() => void) | void,
  initialValue: T
): Readable<T>;
export function derived<O extends Observables, T>(
  sources: O,
  fn: (values: ObservablesValues<O>) => T
): Readable<T>;
export function derived<T>(
  stores: Observables,
  fn: any,
  initialValue?: T
): Readable<T> {
  const single = !Array.isArray(stores);
  const storesArray = single ? [stores] : stores;

  const syncSet = fn.length < 2;

  const values = storesArray.map((store) => store.value);
  const store = readable(
    (set) => {
      let cleanup = undefined;
      let building = true;

      const update = () => {
        if (building) return;

        if (cleanup != undefined) cleanup();

        const plainValues = single ? values[0] : values;

        if (syncSet) {
          set(fn(plainValues));
        } else {
          cleanup = fn(plainValues, set);
        }
      };

      const subscriptions = storesArray.map((store, i) =>
        store.subscribe((value) => {
          values[i] = value;
          update();
        })
      );

      building = false;
      update();

      return () => {
        subscriptions.forEach((subscription) => subscription.unsubscribe());
      };
    },
    syncSet ? fn(values) : initialValue
  );

  return store;
}
