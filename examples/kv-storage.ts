import { persistent } from "../mod.ts";

type Schema = {
  name: string;
  age: number;
  job: {
    salary: number;
  };
};

const defaults: Schema = {
  name: "",
  age: 0,
  job: {
    salary: 0,
  },
};

const kv = await Deno.openKv("./kv.db");

const state = await persistent<Schema>(defaults, {
  read: async () => {
    const readed = await kv.get<Schema>(["state"]);
    return readed.value ?? defaults;
  },
  save: (value: Schema) => kv.set(["state"], value),
}); // read json from path and return proxyfied object

state.job.salary = 35; // saved with provided callback
