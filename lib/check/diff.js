'use strict';

const { hasTemplate, hasTemplateWithAnyString, isRestArrayTemplate } = require('../template/hasTemplate');
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
    if (hasTemplate(small) && large === null) return;

    // {:foo} is template
    if (hasTemplate(small) && large != null) {
      if (hasTemplateWithAnyString(small)) {
        const reg = toRegexp(small);
        if (typeof large === 'string' && large.match(reg)) {
          return;
        }
      } else {
        return;
      }
    }

    // {:foo.1-last} is rest array template
    if (isRestArrayTemplate(small)) {
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
    if (diff && Object.keys(diff).length > 0) {
      result[attr] = diff;
    }
  }
  return result;
};

