import { describe, expect, it } from "vitest";
import { Container, Injectable } from "./ioc";

describe("container", () => {
  it("initializes correctly", () => {
    const container = new Container();

    expect(container).toBeDefined();
  });

  it("can register and resolve unique(non-singleton) services", () => {
    const container = Container.init();
    class Service {}

    container.register(Service, () => new Service());

    expect(container.resolve(Service)).toBeInstanceOf(Service);
    expect(container.resolve(Service)).not.toBe(container.resolve(Service));
  });

  it("can register and resolve singleton services", () => {
    const container = Container.init();
    class Service {}

    container.register(Service, () => new Service(), { singleton: true });

    expect(container.resolve(Service)).toBe(container.resolve(Service));
  });

  it("can register and resolve non-circular dependencies", () => {
    const container = Container.init();
    class ServiceA {
      read() {
        return "expectedString";
      }
    }
    class ServiceB {
      constructor(private serviceA: ServiceA) {
        this.serviceA = serviceA;
      }

      callServiceA() {
        return this.serviceA.read();
      }
    }

    container.register(ServiceA, () => new ServiceA());
    container.register(ServiceB, (deps: any) => new ServiceB(deps[0]), {
      dependencies: [ServiceA],
    });

    const resolved = container.resolve<ServiceB>(ServiceB);
    expect(resolved).toBeInstanceOf(ServiceB);
    expect(resolved.callServiceA()).toBe("expectedString");
  });

  // vitest doesn't support new ES/TS5 decorators https://github.com/vitest-dev/vitest/issues/3140
  it.fails("can register and resolve services via decorators", () => {
    const container = Container.init();
    @Injectable
    class Parrot {}

    expect(container.resolve(Parrot)).toBeInstanceOf(Parrot);
  });
});
