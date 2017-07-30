'use strict';
const constants = require('./constants');
const hasTemplate = require('./hasTemplate').hasTemplate;

module.exports = function bind(hasFormatObj, hasValueObj, result, original) {
  if (!result) result = {};
  if (!original) original = hasValueObj;
  if (typeof hasFormatObj === 'object') {
    Object.keys(hasFormatObj).forEach((key) => {
      if (hasTemplate(hasFormatObj[key])) {
        const formatName = hasFormatObj[key].replace(constants.TEMPLATE_REGEXP, '$2');
        const formatParts = formatName.split('.');
        if (formatParts.length > 1) {
          formatParts.forEach((part) => {
            if (hasValueObj[part]) {
              result[part] = hasValueObj[part];
            } else if (original[part]) {
              result[part] = original[part];
            }
          });
          return;
        }
        result[formatName] = hasValueObj[key];
      } else if (hasFormatObj[key] && typeof hasFormatObj[key] === 'object') {
        bind(hasFormatObj[key], hasValueObj[key], result, original);
      }
    });
  }

  return result;
};
