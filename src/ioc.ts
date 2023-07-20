type RegisterOptions<K> = {
  dependencies?: Array<K>;
  singleton?: boolean;
};

export class Container<K, S> {
  private static instance: Container<unknown, unknown>;
  private registry: Map<
    K,
    [(deps: Array<unknown>) => S, S | null, RegisterOptions<K>]
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
    factory: (deps: Array<unknown>) => T,
    options: RegisterOptions<K> = {}
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
    const deps = options.dependencies?.map((dep) => this.resolve(dep)) ?? [];
    const newInstance = factory(deps);

    resolved[1] = newInstance;
    this.registry.set(key, resolved);

    return <T>(<unknown>newInstance);
  }
}

// TODO: Extend support to functions
export function Injectable<T>(
  target: { new (): T },
  context: { kind: "class" }
): { new (): T } {
  if (context?.kind !== "class")
    throw new Error("@Injectable requires TS >= 5 and only supports classes");
  const container = Container.getInstance();
  container.register(target, () => new target());
  return target;
}
