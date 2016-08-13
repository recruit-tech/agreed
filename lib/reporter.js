'use strict';

const isEmpty = require('is-empty');
const colo = require('colo');
const reason = require('./reason');

module.exports = (agrees, opts) => (results) => {
  return results.map((result, i) => {
    const agree = agrees[i];
    const diff = result.diff;
    const schemaErrors = result.schemaErrors;

    const url = `${opts.scheme}://${opts.host}:${opts.port}${agree.request.path}`;
    if (isEmpty(diff) && isEmpty(schemaErrors)) {
      console.log(`${colo.bold.green('✔ pass!')} ${agree.request.method} ${url}`);
    } else {
      console.log(`${colo.bold.red('✗ fail!')} ${agree.request.method} ${url}`);
      reason.diff(diff);
      reason.schemaErrors(schemaErrors);
    }
  });
};
