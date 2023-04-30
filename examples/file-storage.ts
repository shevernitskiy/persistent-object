import { persistent } from "../mod.ts";

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
