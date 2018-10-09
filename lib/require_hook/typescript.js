'use strict';

const ts = require('typescript');
const fs = require('fs');

const transpile = (src) => {
  const res = ts.transpileModule(src, {
    compilerOptions: {module: ts.ModuleKind.CommonJS}
  }).outputText;
  return res
};

module.exports = () => {
  require.extensions['.ts'] = (module, file) => {
    const src = fs.readFileSync(file).toString('utf-8');
    const agree = transpile(src);
    module._compile(agree, file);
  }
}
