'use strict'

const randomInt = require('./randomInt');
const randomString = require('./randomString');
const parseInt = require('./parseInt');
const unixtime = require('./unixtime');


module.exports = (operation, ...values) => {
  if (operation === 'randomInt') {
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
