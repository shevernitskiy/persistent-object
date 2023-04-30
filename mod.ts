// deno-lint-ignore-file ban-types no-explicit-any

export async function persistent<T extends object>(
  defaults: T,
  callbacks: {
    read: () => Promise<T> | T;
    save: (value: T) => void;
  },
): Promise<T> {
  const store = mergeDeep(defaults, await callbacks.read());

  const handler = {
    get(target: object, key: string | symbol) {
      if (key == "isProxy") return true;
      const prop = target[key];
      if (typeof prop == "undefined") return;
      if (!prop.isProxy && typeof prop === "object") {
        return new Proxy(prop, handler);
      }
      return target[key];
    },
    set(target: object, key: string | symbol, value: any) {
      target[key] = value;
      callbacks.save(store);
      return true;
    },
  };

  return new Proxy<T>(store, handler);
}

function mergeDeep(target: object, ...sources: object[]) {
  if (!sources.length) return target;
  const source = sources.shift();

  if (isObject(target) && isObject(source)) {
    for (const key in source) {
      if (isObject(source[key])) {
        if (!target[key]) Object.assign(target, { [key]: {} });
        mergeDeep(target[key], source[key]);
      } else {
        Object.assign(target, { [key]: source[key] });
      }
    }
  }

  return mergeDeep(target, ...sources);
}

function isObject(item?: object) {
  return (item && typeof item === "object" && !Array.isArray(item));
}
