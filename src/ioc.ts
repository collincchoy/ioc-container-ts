type RegisterOptions = {
  dependencies?: Array<any>;
  singleton?: boolean;
};

export class Container<K, S> {
  private static instance: Container<unknown, unknown>;
  private registry: Map<
    K,
    [(deps?: Array<any>) => S, S | null, RegisterOptions]
  >;
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
    factory: (deps?: Array<any>) => T,
    options: RegisterOptions = {}
  ) {
    if (options.dependencies == undefined) {
      options.dependencies = [];
    }
    this.registry.set(key, [factory, null, options]);
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

    // TODO: Handle circular dependencies
    const deps = options.dependencies?.map((dep) => this.resolve(dep));
    const newInstance = factory(deps);

    resolved[1] = newInstance;
    this.registry.set(key, resolved);

    return <T>(<unknown>newInstance);
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
