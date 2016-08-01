'use strict';

module.exports =  function format(format, args) {
  var result = format;
  if (!args) return result;
  if (Object.keys(args).length === 0) return result;
  var matches = format.match(/\{:([\w|\.]+)\}/g);
  matches && matches.forEach((match) => {
    const rawKey = match.replace(/\{:([\w|\.]+)\}/, '$1');
    const value = rawKey.split('.').reduce((o, i) => o[i], args);
    if (value != null) {
      result = result.replace(match, value);
    }
  });
  return result;
};
