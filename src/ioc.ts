type RegisterOptions = {
  dependencies?: [];
  singleton?: boolean;
};

export class Container<K, S> {
  private static instance: Container<unknown, unknown>;
  private registry: Map<K, [() => S, S | null, RegisterOptions]>;
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

  register<T extends S>(
    key: K,
    factory: () => T,
    options: RegisterOptions = {}
  ) {
    this.registry.set(key, [factory, factory(), options]);
  }

  resolve<T>(key: K): T {
    const resolved = this.registry.get(key);
    if (!resolved) {
      throw new Error(`Failed to resolve ${key}`);
    }
    const [factory, instance, options] = resolved;
    if (options.singleton && instance != null) {
      return instance as T;
    }
    const newSingleton = factory();
    resolved[1] = newSingleton;
    this.registry.set(key, resolved);

    return <T>(<unknown>newSingleton);
  }
}

// @ts-ignore
export function Injectable<T>(target: typeof T, context): typeof T {
  // if (context.kind === "class") {
  // const decorated = class extends target {};
  const container = Container.getInstance();
  container.register(target, () => new target());
  return target;
  // }
}
