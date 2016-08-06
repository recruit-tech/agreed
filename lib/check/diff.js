'use strict';

const hasTemplate = require('../template/hasTemplate').hasTemplate;
const hasTemplateWithAnyString = require('../template/hasTemplate').hasTemplateWithAnyString;
const toRegexp = require('../template/toRegexp');

module.exports = function includeDiff(small, large) {
  const result = {};
  if (small === large) return;

  if (small instanceof Date && large instanceof Date) {
    if (small.getTime() !== large.getTime()) {
      return [small, large];
    }
  }

  if (typeof small !== 'object') {
    if (hasTemplate(small) && large) {
      if (hasTemplateWithAnyString(small)) {
        const reg = toRegexp(small);
        if (typeof large === 'string' && large.match(reg)) {
          return;
        }
      } else {
        return;
      }
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
    if (diff && Object.keys(diff).length > 0) {
      result[attr] = diff;
    }
  }
  return result;
};

