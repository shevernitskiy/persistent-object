# JS/TS Persistent object

This tiny function provide persistences for json serializable object. It's possible with using proxy and set/get
callbacks. Everytime you mutate the object, it calls defined `save` callback. Default value needed for deep nesting
support.

## Example

Example with storage in simple json file.

```ts
import { persistent } from "https://deno.land/x/persistent@v1.2.0/mod.ts";

type Schema = {
  name: string;
  age: number;
  job: {
    salary: number;
  };
};

const path = "./state.json";
const defaults: Schema = {
  name: "",
  age: 0,
  job: {
    salary: 0,
  },
};

const state = await persistent<Schema>(defaults, {
  read: () => {
    let data: Schema = defaults;
    try {
      data = JSON.parse(Deno.readTextFileSync(path));
    } catch {
      //
    }
    return data;
  },
  save: (value: Schema) => Deno.writeTextFileSync(path, JSON.stringify(value, null, 2)),
}); // read json from path and return proxyfied object

state.job.salary = 35; // saved with provided callback
```

# Contribution

Pull request, issues and feedback are very welcome. Code style is formatted with `deno fmt`.

# License

Copyright 2023, shevernitskiy. MIT license.
