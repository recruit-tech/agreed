'use strict';

const isEmpty = require('is-empty');
const colo = require('colo');
const reason = require('./reason');

module.exports = (agrees, opts) => (diffs) => {
  return diffs.map((diff, i) => {
    const agree = agrees[i];

    const url = `${opts.scheme}://${opts.host}:${opts.port}${agree.request.path}`;
    if (isEmpty(diff)) {
      console.log(`${colo.bold.green('✔ pass!')} ${agree.request.method} ${url}`);
    } else {
      console.log(`${colo.bold.red('✗ fail!')} ${agree.request.method} ${url}`);
      reason(diff);
    }
  });
};
