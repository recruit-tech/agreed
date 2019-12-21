"use strict";

const json5Hook = require("./require_hook/json5");
const yamlHook = require("./require_hook/yaml");
const tsHook = require("./require_hook/typescript");

module.exports = (option = {}, hot = true) => {
  json5Hook();
  yamlHook();
  tsHook(option, hot);
};
