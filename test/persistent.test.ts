import { assertEquals } from "https://deno.land/std@0.177.0/testing/asserts.ts";

import { persistent } from "../mod.ts";

type ObjectSchema = {
  name: string;
  age: number;
  job: {
    salary: number;
  };
};

const path = "./test/object.json" as const;

Deno.test(
  "persistent test",
  () => {
    const defaults: ObjectSchema = {
      name: "John",
      age: 0,
      job: {
        salary: 0,
      },
    };

    Deno.writeTextFileSync(path, JSON.stringify(defaults));

    const state = persistent<ObjectSchema>(defaults, {
      read: () => {
        let data: ObjectSchema = defaults;
        try {
          data = JSON.parse(Deno.readTextFileSync(path));
        } catch {
          //
        }
        return data;
      },
      save: (value: ObjectSchema) =>
        Deno.writeTextFileSync(path, JSON.stringify(value, null, 2)),
    });
    state.age = 35;
    state.job.salary = 2500;

    const result = JSON.parse(Deno.readTextFileSync(path));
    Deno.remove(path);

    assertEquals({
      name: "John",
      age: 35,
      job: {
        salary: 2500,
      },
    }, result);
  },
);
