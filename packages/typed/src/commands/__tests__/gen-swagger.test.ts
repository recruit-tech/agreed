import * as path from "path";
import "../../hook";
import { run } from "../gen-swagger";
import test from "node:test";
import assert from "node:assert";

test("e2e testing", () => {
  const agreedPath = path.resolve(__dirname, "../../__tests__/data/agreed.ts");
  const swagger = run({
    path: agreedPath,
    depth: 2,
    title: "testing",
    description: "test description",
    version: "test",
    host: "",
    disablePathNumber: false
  });
  assert.strictEqual(swagger.info.title, "testing");
});
