'use strict';

module.exports = format;

const constants = require('./constants');

function format(template, args) {
  var result = template;

  if (Array.isArray(template)) {
    return formatArray(template, args);
  }

  if (typeof template === 'object') {
    return formatObject(template, args);
  }

  if (typeof template !== 'string') {
    return result;
  }

  if (!args) return result;
  if (Object.keys(args).length === 0) return result;

  // matches {:foo} {:foo.bar} {:foo[:aaa]}
  const matches = template.match(constants.TEMPLATE_REGEXP_GLOBAL);
  
  if (!matches) return result;

  matches.forEach((match) => {
    var rawKey = match.replace(constants.TEMPLATE_REGEXP, '$1');

    // brackets notation like '{:array[:index]}'
    if (rawKey.indexOf('[:') >= 0) {
      const matches = rawKey.match(constants.TEMPLATE_BRACKETS_REGEXP_GLOBAL);

      matches && matches.forEach((match) => {
        const key = match.replace(constants.TEMPLATE_BRACKETS_REGEXP, '$1');
        const value = '.' + key.split('.').reduce((o, i) => o && o[i], args);

        if (value != null) {
          rawKey = rawKey.replace(match, value);
        }
      });
    }

    const value = rawKey.split('.').reduce((o, i) => o && o[i], args);
    if (value != null) {
      if (match === template) {
        result = value;
      } else {
        result = result.replace(match, value);
      }
    }
  });

  return result;
}

function formatObject(obj, args) {
  var result = {};
  if (!obj) {
    return obj;
  }

  Object.keys(obj).forEach((key) => {
    const value = obj[key];
    result[key] = format(value, args);
  });
  return result;
}

function formatArray(array, args) {
  var result = [];
  if (!array) {
    return array;
  }

  array.forEach((item) => {
    result.push(format(item, args));
  });

  return result;
}

