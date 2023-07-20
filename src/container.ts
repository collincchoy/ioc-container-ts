export class Container<K, S> {
  private registry: Map<K, [() => S, S | null]>;
  constructor() {
    this.registry = new Map();
  }

  register<T extends S>(key: K, factory: () => T) {
    this.registry.set(key, [factory, factory()]);
  }

  resolve<T>(key: K): T {
    const resolved = this.registry.get(key);
    if (!resolved) {
      throw new Error("Failed to resolve `key`");
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
