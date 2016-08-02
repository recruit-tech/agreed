'use strict';

module.exports = (str) => {
  return typeof str === 'string' && str.match(/\{:([\w|\.]+)\}/g);
};
