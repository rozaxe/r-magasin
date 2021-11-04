import { readable, writable } from "../";
import { DisposedError } from "../DisposedError";

describe("readable", () => {
  it("should create a simple readable", () => {
    const clock = readable((setter) => {
      setter(42);
    }, 0);
    expect(clock.value).toBe(42);
  });

  it("should iterate readable", (done) => {
    const callbackMock = jest.fn();
    const clock = readable((set, getValue) => {
      const interval = setInterval(() => {
        set(getValue() + 1);
      }, 300);

      return () => {
        clearInterval(interval);
      };
    }, 0);

    clock.subscribe(callbackMock);

    setTimeout(() => {
      clock.dispose();
      expect(callbackMock).toHaveBeenCalledTimes(3);
      expect(callbackMock).toHaveBeenNthCalledWith(1, 0);
      expect(callbackMock).toHaveBeenNthCalledWith(2, 1);
      expect(callbackMock).toHaveBeenNthCalledWith(3, 2);
      done();
    }, 750);
  });

  it("should call cleanup effect and retain last value", () => {
    const cleanupMock = jest.fn();
    const clock = readable((set) => {
      set(42);
      return cleanupMock;
    }, 0);

    clock.dispose();

    expect(cleanupMock).toHaveBeenCalledTimes(1);
    expect(clock.value).toBe(42);
  });

  it("should throw on values set while it has been disposed", (done) => {
    const clock = readable((set) => {
      setTimeout(() => {
        expect(() => {
          set(42);
        }).toThrowError(DisposedError);
        done();
      }, 100);
    }, 0);
    clock.dispose();
  });

  it("should throw dispose twice", () => {
    const clock = readable(() => {}, 0);
    clock.dispose();
    expect(() => {
      clock.dispose();
    }).toThrowError(DisposedError);
  });
});
