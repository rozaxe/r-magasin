import { writable } from "../";

describe("writable", () => {
  it("should create a simple writable", () => {
    const init = writable(42);
    expect(init.value).toBe(42);
  });

  it("should set writable", () => {
    const count = writable(0);
    expect(count.value).toBe(0);
    count.set(51);
    expect(count.value).toBe(51);
  });

  it("should update writable", () => {
    const count = writable(10);
    expect(count.value).toBe(10);
    count.update((x) => x * 2);
    expect(count.value).toBe(20);
  });

  it("should notify observer", () => {
    const count = writable(10);
    const callbackMock = jest.fn();

    count.subscribe(callbackMock);

    expect(callbackMock).toHaveBeenCalledTimes(1);
    expect(callbackMock).toHaveBeenCalledWith(10);
  });

  it("should notify many times observer", () => {
    const count = writable(10);
    const callbackMock = jest.fn();

    count.subscribe(callbackMock);

    count.set(20);

    expect(callbackMock).toHaveBeenCalledTimes(2);
    expect(callbackMock).toHaveBeenNthCalledWith(1, 10);
    expect(callbackMock).toHaveBeenNthCalledWith(2, 20);
  });

  it("should allow observer to unsubscribe", () => {
    const count = writable(10);
    const callbackMock = jest.fn();

    const subscription = count.subscribe(callbackMock);

    subscription.unsubscribe();

    count.set(20);

    expect(callbackMock).toHaveBeenCalledTimes(1);
    expect(callbackMock).toHaveBeenNthCalledWith(1, 10);
  });

  it("should notify multiples observers", () => {
    const count = writable(10);
    const callbackMock1 = jest.fn();
    const callbackMock2 = jest.fn();

    count.subscribe(callbackMock1);
    count.set(20);

    count.subscribe(callbackMock2);
    count.set(30);

    expect(callbackMock1).toHaveBeenCalledTimes(3);
    expect(callbackMock1).toHaveBeenNthCalledWith(1, 10);
    expect(callbackMock1).toHaveBeenNthCalledWith(2, 20);
    expect(callbackMock1).toHaveBeenNthCalledWith(3, 30);

    expect(callbackMock2).toHaveBeenCalledTimes(2);
    expect(callbackMock2).toHaveBeenNthCalledWith(1, 20);
    expect(callbackMock2).toHaveBeenNthCalledWith(2, 30);
  });

  it("should not notify observer on equity value", () => {
    const count = writable(10);
    const callbackMock = jest.fn();

    count.subscribe(callbackMock);

    count.set(10);
    count.set(10);

    expect(callbackMock).toHaveBeenCalledTimes(1);
  });
});
