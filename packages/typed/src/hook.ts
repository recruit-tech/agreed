import * as fs from "fs";
import * as ts from "typescript";

const transpile = (src, options = {}) => {
  const res = ts.transpileModule(
    src,
    options || {
      compilerOptions: { module: ts.ModuleKind.CommonJS }
    }
  ).outputText;
  return res;
};

require.extensions[".ts"] = (module: any, file) => {
  const src = fs.readFileSync(file).toString("utf-8");
  const agree = transpile(src, {});
  module._compile(agree, file);
};
