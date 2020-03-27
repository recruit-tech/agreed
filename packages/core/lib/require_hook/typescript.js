"use strict";

const ts = require("typescript");
const fs = require("fs");
let cache = null;

const transpile = (src, options = {}) => {
  const res = ts.transpileModule(
    src,
    options || {
      compilerOptions: { module: ts.ModuleKind.CommonJS }
    }
  ).outputText;
  return res;
};

const takeCache = (options) => {
  try {
    if (!cache && options.typedCachePath) {
      const data = fs.readFileSync(options.typedCachePath).toString("utf-8");
      cache = JSON.parse(cache);
      return cache;
    }
    return {};
  } catch(e) {
    return {};
  }
}

const getCacheAgree = (file, cache, mtimeMs) => {
  if (cache && cache[file]) {
    if (cache[file].mtimeMs === mtimeMs) {
      return cache[file];
    }
  }
  return {};
}

const writeCacheOnExit = (options) => {
  if (options.typedCachePath) {
    process.once("exit", () => {
      fs.writeFileSync(options.typedCachePath, JSON.stringify(cache));
    });
  }
}

module.exports = (options, hot) => {
  const cache = takeCache(options);
  writeCacheOnExit(options);
  require.extensions[".ts"] = (module, file) => {
    const { mtimeMs } = fs.statSync(file);
    const cached = getCacheAgree(file, cache, mtimeMs);
    let agree = cached.agree;
    if (!agree) {
      const src = fs.readFileSync(file).toString("utf-8");
      agree = transpile(src, options);
      cache[file] = {
        mtimeMs,
        agree,
      };
    }
    module._compile(agree, file);
    if (hot) {
      delete require.cache[file];
    }
  };
};
