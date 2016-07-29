module.exports = (module, file, object) => {
  module._compile('module.exports = ' + JSON.stringify(object), file);
}
