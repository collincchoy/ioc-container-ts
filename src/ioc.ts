export class Container<K, S> {
  private static instance: Container<unknown, unknown>;
  private registry: Map<K, [() => S, S | null]>;
  constructor() {
    this.registry = new Map();
  }

  static init() {
    return Container.getInstance();
  }

  static getInstance<M, N>(): Container<M, N> {
    if (!Container.instance) {
      Container.instance = new Container();
    }
    return Container.instance as Container<M, N>;
  }

  register<T extends S>(key: K, factory: () => T) {
    this.registry.set(key, [factory, factory()]);
  }

  resolve<T>(key: K): T {
    const resolved = this.registry.get(key);
    if (!resolved) {
      throw new Error(`Failed to resolve ${key}`);
    }
    if (resolved[1] != null) {
      return resolved[1] as T;
    }
    const newSingleton = resolved[0]();
    resolved[1] = newSingleton;
    this.registry.set(key, resolved);

    return <T>(<unknown>newSingleton);
  }
}

// @ts-ignore
export function Injectable<T>(target: typeof T, context): typeof T {
  // if (context.kind === "class") {
  const decorated = class extends target {
    fuel: number = 50;
    isEmpty(): boolean {
      return this.fuel == 0;
    }
  };
  const container = Container.getInstance();
  container.register(decorated, () => new decorated());
  return decorated;
  // }
}
