const importFresh = require("import-fresh");

module.exports = module => {
  return importFresh(module);
};
