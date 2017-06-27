'use strict';
const constants = require('./constants');
const hasTemplate = require('./hasTemplate').hasTemplate;

module.exports = function bind(hasFormatObj, hasValueObj, result) {
  if (!result) result = {};
  if (typeof hasFormatObj === 'object') {
    const keysWithTemplates = Object.keys(hasFormatObj).filter((key) => {
      if (hasTemplate(hasFormatObj[key])) {
        const formatName = hasFormatObj[key].replace(constants.TEMPLATE_REGEXP, '$2');
        const names = formatName.split('.');
        if (names.length > 1) {
          names.forEach((name) => {
            if (hasValueObj[name]) {
              result[name] = hasValueObj[name];
            }
          });
          return;
        }
        result[formatName] = hasValueObj[key];
      } else if (hasFormatObj[key] && typeof hasFormatObj[key] === 'object') {
        bind(hasFormatObj[key], hasValueObj[key], result);
      }
    });
  }

  return result;
};
