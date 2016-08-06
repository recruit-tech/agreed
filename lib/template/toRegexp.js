'use strict';

const constants = require('./constants');

module.exports = (str) => {
  var rawString = str.replace(constants.TEMPLATE_REGEXP_GLOBAL, '.*');
  rawString = '^' + rawString + '$';
  return new RegExp(rawString);
};

