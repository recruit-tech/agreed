'use strict';

const hasTemplate = require('../template/hasTemplate').hasTemplate;

module.exports = function isInclude(small, large) {
  if (small === large) return true;

  if (small instanceof Date && large instanceof Date) {
    return small.getTime() === large.getTime();
  }

  if (typeof small != 'object' && typeof large != 'object') {
    if ((hasTemplate(small) && large) || (small && hasTemplate(large))) {
      return true;
    }
    return small == large;
  }

  if ((small && !large) || (!small && large)) {
    return false;
  }

  const attrs = Object.keys(small);
  for (const attr of attrs) {
    if(!isInclude(small[attr], large[attr])) return false;
  }
  return true;
};
