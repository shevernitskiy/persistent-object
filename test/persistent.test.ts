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
    Deno.writeTextFileSync(
      path,
      JSON.stringify({
        name: "John",
        age: 22,
        job: {
          salary: 1000,
        },
      }),
    );

    const state = persistent<ObjectSchema>(path, {
      name: "",
      age: 0,
      job: {
        salary: 0,
      },
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
