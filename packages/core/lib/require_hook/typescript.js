"use strict";

const ts = require("typescript");
const fs = require("fs");
let cache = null;

const transpile = (src, options = {}) => {
  const res = ts.transpileModule(
    src,
    options || {
      compilerOptions: { module: ts.ModuleKind.CommonJS },
    }
  ).outputText;
  return res;
};

const takeCache = (options) => {
  try {
    if (!cache && options.typedCachePath) {
      const data = fs.readFileSync(options.typedCachePath).toString("utf-8");
      const cache = JSON.parse(data);
      return cache;
    }
    return {};
  } catch (e) {
    return {};
  }
};

const getCacheAgree = (file, cache, mtimeMs) => {
  if (cache && cache[file]) {
    if (cache[file].mtimeMs === mtimeMs) {
      return cache[file];
    }
  }
  return {};
};

const writeCacheOnExit = (options) => {
  if (options.typedCachePath) {
    process.on("SIGINT", () => {
      process.exit();
    });
    process.on("exit", () => {
      if (cache) {
        fs.writeFileSync(options.typedCachePath, JSON.stringify(cache));
      }
    });
  }
};

module.exports = (options, hot) => {
  cache = takeCache(options);
  writeCacheOnExit(options);
  require.extensions[".ts"] = (module, file) => {
    if (!options.typedCachePath) {
      const src = fs.readFileSync(file).toString("utf-8");
      const agree = transpile(src, options);
      module._compile(agree, file);
      if (hot) {
        delete require.cache[file];
      }
      return;
    }
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
    // TODO: need to embed cache hit or not
    module._compile(agree, file);
    if (hot) {
      fs.watch(file, () => {
        delete require.cache[file];
        delete cache[file];
      });
    }
  };
};
