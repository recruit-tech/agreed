'use strict';

const hasTemplate = require('../template/hasTemplate');

module.exports = function includeDiff(small, large) {
  const result = {};
  if (small === large) return;

  if (small instanceof Date && large instanceof Date) {
    if (small.getTime() !== large.getTime()) {
      return [small, large];
    }
  }

  if (typeof small != 'object') {
    if (hasTemplate(small) && large) {
      return;
    }
    return [small, large];
  }

  if ((small && !large) || (!small && large)) {
    return [small, large];
  }

  if (typeof small !== typeof large) {
    return [small, large];
  }

  const attrs = Object.keys(small);
  for (const attr of attrs) {
    const diff = includeDiff(small[attr], large[attr]);
    if (diff) {
      result[attr] = diff;
    }
  }
  return result;
};

