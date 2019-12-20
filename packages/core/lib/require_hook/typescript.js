"use strict";

const ts = require("typescript");
const fs = require("fs");

const transpile = (src, options = {}) => {
  const res = ts.transpileModule(
    src,
    options || {
      compilerOptions: { module: ts.ModuleKind.CommonJS }
    }
  ).outputText;
  return res;
};

module.exports = (options, hot) => {
  require.extensions[".ts"] = (module, file) => {
    const src = fs.readFileSync(file).toString("utf-8");
    const agree = transpile(src, options);
    module._compile(agree, file);
    if (hot) {
      delete require.cache[file];
    }
  };
};
