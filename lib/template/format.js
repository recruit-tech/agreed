'use strict';

module.exports =  function format(format, args) {
  var result = format;
  if (!args) return result;
  if (Object.keys(args).length === 0) return result;
  var matches = format.match(/\{:(\w+)\}/g);
  matches && matches.forEach((match) => {
    var rawKey = match.replace(/\{:(\w+)\}/, '$1');
    if (args[rawKey] !== null) {
      result = result.replace(match, args[rawKey]);
    }
  });
  return result;
};
