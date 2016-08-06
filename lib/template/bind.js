'use strict';
const hasTemplate = require('./hasTemplate').hasTemplate;

module.exports = function bind(hasFormatObj, hasValueObj, result) {
  if (!result) result = {};
  if (typeof hasFormatObj === 'object') {
    const keysWithTemplates = Object.keys(hasFormatObj).filter((key) => {
      if (hasTemplate(hasFormatObj[key])) {
        const formatName = hasFormatObj[key].replace(/\{:([\w|\.]+)\}/, '$1');
        result[formatName] = hasValueObj[key];
      } else if (hasFormatObj[key] && typeof hasFormatObj[key] === 'object') {
        bind(hasFormatObj[key], hasValueObj[key], result);
      }
    });
  }

  return result;
};
