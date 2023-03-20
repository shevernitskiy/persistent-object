# JS/TS Persistent object

This tiny function provide persistences for json serializable object. It's
possible with using proxy and set/get callbacks. Everytime you mutate the
object, it writes to file with given path. If file not exists, it will be
created. Default value needed for deep nesting support.

Implemeted for Deno, but could be adapted for any engine.

### Example

```ts
import { persistent } from "https://raw.githubusercontent.com/shevernitskiy/persistent-object/main/mod.ts";

type Schema = {
  name: string;
  age: number;
  job: {
    salary: number;
  };
};

const state = persistent<Schema>("./state.json", {
  name: "",
  age: 0,
  job: {
    salary: 0,
  },
}); // read json from path and return proxyfied object

state.job.salary = 35; // saved to file!
```

### Contribution

Pull request, issues and feedback are very welcome. Code style is formatted with
`deno fmt`.

### Licence

Copyright 2023, shevernitskiy. MIT license.
