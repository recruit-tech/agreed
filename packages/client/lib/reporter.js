'use strict';

const isEmpty = require('is-empty');
const colo = require('colo');
const reason = require('./reason');

module.exports = (agrees) => (results) => {
  return results.map((result, i) => {
    const agree = agrees[i];
    const body = result.body;
    const diff = result.diff;
    const schemaErrors = result.schemaErrors;

    const path = `${agree.request.path}`;
    if ((isEmpty(result) || isEmpty(diff)) && isEmpty(schemaErrors)) {
      console.log(`${colo.bold.green('✔ pass!')} ${agree.request.method} ${path}`);
    } else {
      console.log(`${colo.bold.red('✗ fail!')} ${agree.request.method} ${path}`);
      body && console.log(`${colo.green('body: ')}`, body);
      reason.diff(diff);
      reason.schemaErrors(schemaErrors);
    }
  });
};
