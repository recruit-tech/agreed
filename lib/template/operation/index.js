'use strict'

const randomInt = require('./randomInt');
const parseInt = require('./parseInt');


module.exports = (operation, ...values) => {
  if (operation === 'randomInt') {
    const [ value ] = values;
    const result = randomInt(value);
    return result;
  } else if (operation === 'parseInt') {
    const [ value ] = values;
    const result = parseInt(value);
    return result;
  }

};
