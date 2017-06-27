const constants = require('./constants');
const merge = require('deepmerge');
const hasTemplate = require('./hasTemplate').hasTemplate;

module.exports = function bind(hasFormatObj, hasValueObj, result) {
  if (!result) result = {};
  if (typeof hasFormatObj === 'object') {
    const keys = Object.keys(hasFormatObj);
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      if (hasTemplate(hasFormatObj[key])) {
        const formatName = hasFormatObj[key].replace(constants.TEMPLATE_REGEXP, '$2');
        const names = formatName.split('.');
        if (names.length > 1 && typeof hasValueObj[key] === 'object') {
          result = merge(result, walkTree(names, hasValueObj[key]));
        } else if (names.length > 1) {
          result = merge(result, walkTree(names, hasValueObj));
        } else {
          result[formatName] = hasValueObj[key];
        }
      } else if (hasFormatObj[key] && typeof hasFormatObj[key] === 'object') {
        return bind(hasFormatObj[key], hasValueObj[key], result);
      }
    }
  }

  return result;
};

// keys: [ a, b, c ]
// values: { a: { b: { c: 123, d: 223 } } }
// return { a: { b: { c: 123 } } }
function walkTree(keys, values) {
  const key = keys[0];
  const result = {};
  if (values[key] && keys.length >= 2) {
    result[key] = walkTree(keys.slice(1), values[key], result[key]);
    return result;
  } else if (keys.length >= 2) {
    result[key] = walkTree(keys.slice(1), values, result[key]);
    return result;
  } else {
    result[key] = values[key];
    return result;
  }
}
