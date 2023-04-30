import { assertEquals } from "https://deno.land/std@0.177.0/testing/asserts.ts";

import { persistent } from "../mod.ts";

type ObjectSchema = {
  name: string;
  age: number;
  job: {
    salary: number;
  };
};

const defaults: ObjectSchema = {
  name: "John",
  age: 0,
  job: {
    salary: 0,
  },
};

const path = "./test/object.json" as const;

Deno.test("file storage", async () => {
  Deno.writeTextFileSync(path, JSON.stringify(defaults));

  const state = await persistent<ObjectSchema>(defaults, {
    read: () => {
      let data: ObjectSchema = defaults;
      try {
        data = JSON.parse(Deno.readTextFileSync(path));
      } catch {
        //
      }
      return data;
    },
    save: (value: ObjectSchema) => Deno.writeTextFileSync(path, JSON.stringify(value, null, 2)),
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
});

Deno.test("kv storage", async () => {
  const defaults: ObjectSchema = {
    name: "John",
    age: 0,
    job: {
      salary: 0,
    },
  };

  Deno.writeTextFileSync(path, JSON.stringify(defaults));

  const kv = await Deno.openKv("./kv.db");
  await kv.set(["state"], defaults);

  const state = await persistent<ObjectSchema>(defaults, {
    read: async () => {
      const readed = await kv.get<ObjectSchema>(["state"]);
      return readed.value ?? defaults;
    },
    save: (value: ObjectSchema) => kv.set(["state"], value),
  });
  state.age = 35;
  state.job.salary = 2500;

  const result = await kv.get<ObjectSchema>(["state"]);
  await kv.close();
  Deno.remove("./kv.db");

  assertEquals({
    name: "John",
    age: 35,
    job: {
      salary: 2500,
    },
  }, result.value);
});
