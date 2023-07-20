import { describe, expect, it } from "vitest";
import { Container, Injectable } from "./ioc";

describe("container", () => {
  it("initializes correctly", () => {
    const container = new Container();

    expect(container).toBeDefined();
  });

  it("can register and resolve services", () => {
    const container = Container.init();
    class Service {}

    container.register(Service, () => new Service());

    expect(container.resolve(Service)).toBeInstanceOf(Service);
  });

  // vitest doesn't support new ES/TS5 decorators https://github.com/vitest-dev/vitest/issues/3140
  it.fails("can register and resolve services via decorators", () => {
    const container = Container.init();
    @Injectable
    class Parrot {}

    expect(container.resolve(Parrot)).toBeInstanceOf(Parrot);
  });
});
