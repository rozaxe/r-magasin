import { derived, writable } from "../";
import { Observable } from "../Observable";
import { Writable } from "../Writable";

describe("derived", () => {
  let simple: Writable<number>;
  let factor: Writable<number>;

  beforeEach(() => {
    simple = writable(1);
    factor = writable(3);
  });

  it("should create a simple derived", () => {
    const double = derived(simple, (n) => n * 2);
    expect(double.value).toBe(2);
  });

  it("should allow to dispose derived", () => {
    const double = derived(simple, (n) => n * 2);
    double.dispose();
    simple.set(42);
    expect(double.value).toBe(2);
  });

  it("should call cleanup on input's value changed", () => {
    const cleanupEffect = jest.fn();
    const result = derived(
      [simple, factor],
      ([s, f], set) => {
        const r = s * f;
        if (r > 10) {
          set(r);
        }
        return cleanupEffect;
      },
      10
    );
    expect(result.value).toBe(10);
    simple.set(3);
    expect(result.value).toBe(10);
    factor.set(4);
    expect(result.value).toBe(12);
    expect(cleanupEffect).toHaveBeenCalledTimes(2);
  });
});
