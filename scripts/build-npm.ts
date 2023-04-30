if (Deno.args[0] === undefined) {
  throw Error("missing version arg!");
}

console.log("removing previous files..");

try {
  Deno.removeSync("./npm/", { recursive: true });
} catch { //
}

try {
  Deno.mkdir("./npm/");
} catch { //
}

console.log("compiling stuff...");

const cmd = new Deno.Command("deno", {
  args: ["run", "-A", "https://deno.land/x/deno2node/src/cli.ts"],
});
await cmd.output();

console.log("writing package.json, version " + Deno.args[0] + "...");

const pakcage = {
  name: "@shevernitskiy/persistent-object",
  description: "Every mutation of the object synced to storage",
  version: Deno.args[0],
  author: "shevernitskiy",
  license: "MIT",
  engines: {
    node: ">= 18",
  },
  repository: {
    type: "git",
    url: "https://github.com/shevernitskiy/persistent-object",
  },
  files: ["./mod.js", "./mod.d.ts"],
  main: "./mod.js",
  types: "./mod.d.ts",
  keywords: [
    "persistent",
    "function",
    "persistence",
    "data",
    "storage",
  ],
};
Deno.writeTextFileSync("./npm/package.json", JSON.stringify(pakcage, null, 2), { create: true });

console.log("copy some stuff...");

Deno.copyFileSync("./README.md", "./npm/README.md");
Deno.copyFileSync("./LICENSE", "./npm/LICENSE");

console.log("all done!");
