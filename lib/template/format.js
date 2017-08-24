'use strict';

module.exports = format;

const constants = require('./constants');
const operation = require('./operation');

function format(template, args, funcs = {}) {
  var result = template;

  if (Array.isArray(template)) {
    return formatArray(template, args, funcs);
  }

  if (typeof template === 'object') {
    return formatObject(template, args, funcs);
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
    var rawKey = match.replace(constants.TEMPLATE_REGEXP, '$2');

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

    var value = rawKey.split(',').map((key) => {
      if (key && args[key]) {
        return args[key];
      }
      return key.split('.').reduce((val, k) => {
        if (val) {
          const a = k.match(/(\d+)-(\d+|last)/);
          if (a) {
            const start = a[1];
            const end = a[2] === 'last' ? val.length : a[2];
            const array = val.slice(start, end);
            array.__spread = true;
            return array;
          }
          return val[k];
        }
      }, args);
    });

    var operationalKey = match.replace(constants.TEMPLATE_REGEXP, '$1');
    if (operationalKey) {
      var operationValue = operation(operationalKey, funcs, ...value);
    }

    if (Array.isArray(value) && value.length === 1) {
      value = value[0];
    }

    if (operationValue) {
      value = operationValue;
    }

    if (value === undefined) {
      return
    }

    if (match === template) {
      result = value;
    } else {
      result = result.replace(match, value);
    }
  });

  return result;
}

function formatObject(obj, args, funcs) {
  var result = {};
  if (!obj) {
    return obj;
  }

  Object.keys(obj).forEach((key) => {
    const value = obj[key];
    result[key] = format(value, args, funcs);
  });
  return result;
}

function formatArray(array, args, funcs) {
  var result = [];
  if (!array) {
    return array;
  }

  array.forEach((item) => {
    const formattedItem = format(item, args, funcs);
    if (formattedItem.__spread) {
      formattedItem.forEach((item) => {
        result.push(item);
      });
    } else {
      result.push(formattedItem);
    }
  });

  return result;
}

