'use strict';

const json5Hook = require('./require_hook/json5');
const yamlHook = require('./require_hook/yaml');

module.exports = () => {
  json5Hook();
  yamlHook();
};
