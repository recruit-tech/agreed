'use strict'


function randomInt(value) {
  if (typeof value !== 'string') {
    return Math.trunc(Math.random() * 100);
  }
  const matched = value.match(/(\d+)-(\d+)/);
  if (!matched) {
    return Math.trunc(Math.random() * 100);
  }
  const min = matched[1];
  const max = matched[2];
  if (min > max) {
    return Math.trunc(Math.random() * 100);
  }
  return Math.trunc((Math.random() * (max - min) + min));
}

module.exports = (operation, ...values) => {
  if (operation === 'randomInt') {
    const [ value ] = values;
    const result = randomInt(value);
    return result;
  }
};
