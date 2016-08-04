'use strict';

module.exports = format;

function format(template, args, result) {
  if (typeof template !== 'string') {
    return formatObject(template, args, result);
  }

  result = template;

  if (!args) return result;
  if (Object.keys(args).length === 0) return result;

  const matches = template.match(/\{:([\w|\.]+)\}/g);
  
  if (!matches) return result;

  matches.forEach((match) => {
    const rawKey = match.replace(/\{:([\w|\.]+)\}/, '$1');
    const value = rawKey.split('.').reduce((o, i) => o[i], args);
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

function formatObject(obj, args, result) {
  if (!obj) {
    return obj;
  }

  if (!result) {
    result = {};
  }

  Object.keys(obj).forEach((key) => {
    const value = obj[key];
    result[key] = format(value, args, result);
  });
  return result;
}

