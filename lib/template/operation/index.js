'use strict'

const randomInt = require('./randomInt');
const randomString = require('./randomString');
const parseInt = require('./parseInt');
const unixtime = require('./unixtime');
const path = require('path');

module.exports = (operation, funcs, ...values) => {
  if (typeof funcs[operation] === 'function') {
    const result = funcs[operation](...values);
    return result;
  } else if (typeof funcs[operation] === 'string') {
    const basedir = funcs.basedir || process.cwd();
    const funcPath = path.resolve(basedir, funcs[operation]);
    const result = require(funcPath)(...values)
    return result;
  } else if (operation === 'randomInt') {
    const [ value ] = values;
    const result = randomInt(value);
    return result;
  } else if (operation === 'parseInt') {
    const [ value ] = values;
    const result = parseInt(value);
    return result;
  } else if (operation === 'randomString') {
    const [ value ] = values;
    const result = randomString(value);
    return result;
  } else if (operation === 'unixtime') {
    const result = unixtime();
    return result;
  }
};
