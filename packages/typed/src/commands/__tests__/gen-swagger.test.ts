import * as path from "path";
import "../../hook";
import { run } from "../gen-swagger";

test.skip("e2e testing", () => {
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

  expect(swagger).toMatchSnapshot();
});
