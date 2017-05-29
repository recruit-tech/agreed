'use strict';

const constants = require('./constants');

module.exports.hasTemplate = (str) => {
  return typeof str === 'string' && str.match(constants.TEMPLATE_REGEXP_GLOBAL);
};

module.exports.hasTemplateWithAnyString = (str) => {
  if (typeof str !== 'string') {
    return false;
  }
  const removed = str.replace(constants.TEMPLATE_REGEXP_GLOBAL, '');
  return removed.length > 0;
};

module.exports.isRestArrayTemplate = (str) => {
  return typeof str === 'string' && str.match(constants.TEMPLATE_REST_ARRAY_STRING_GLOBAL);
};
