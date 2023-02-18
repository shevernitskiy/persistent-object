# JS/TS Persistent object

This tiny function provide persistences for json serializable object. It's
possible with using proxy and set/get callbacks. Everytime you mutate the
object, it writes to file with given path. For initialization, file should
contain valid JSON string accroding to schema. Supports deep nested objects.

Implemeted for Deno, but could be adapted for ny engine.

### Example

```ts
import { persistent } from "https://raw.githubusercontent.com/shevernitskiy/persistent/mod.ts";

const path = "./test/object.json" as const;

type Schema = {
  name: string;
  age: number;
  job: {
    salary: number;
  };
};

const state = persistent<Schema>(path); // read json from path and return proxyfied object

state.age = 35; // saved to file!
```

### Contribution

Pull request, issues and feedback are very welcome. Code style is formatted with
`deno fmt` and commit messages are done following Conventional Commits spec.

### Licence

Copyright 2023, shevernitskiy. MIT license.
