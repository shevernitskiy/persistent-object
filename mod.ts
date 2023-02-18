// deno-lint-ignore-file ban-types no-explicit-any

export function persistent<T extends object>(path: string): T {
  const store = JSON.parse(Deno.readTextFileSync(path)) as T;

  const handler = {
    get(target: object, key: string | symbol) {
      if (key == "isProxy") return true;
      const prop = target[key];
      if (typeof prop == "undefined") return;
      if (!prop.isProxy && typeof prop === "object") {
        target[key] = new Proxy(prop, handler);
      }
      return target[key];
    },
    set(target: object, key: string | symbol, value: any) {
      target[key] = value;
      Deno.writeTextFileSync(path, JSON.stringify(store, null, 2));
      return true;
    },
  };

  return new Proxy<T>(store, handler);
}
