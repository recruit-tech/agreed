'use strict';

const colo = require('colo');
const isEmpty = require('is-empty');

module.exports.schemaErrors = (errors) => {
  if (isEmpty(errors)) {
    return;
  }

  if (Array.isArray(errors)) {
    errors.forEach((error) => {
      console.log(`${colo.bold('schema errors are found.')}`);
      console.log(error.stack);
    });
  }
};

module.exports.diff = function reason(diff, depth) {
  if (depth == null) {
    depth = 0;
  }
  if (Array.isArray(diff) && diff.length === 2) {
    console.log('');
    const agreed = diff[0];
    const actual = diff[1];
    const exp = explain(agreed, actual);
    exp && console.log(colo.bold(exp));
    console.log(`${colo.bold.cyan('agreed: ')} ${show(agreed)}`);
    console.log(`${colo.bold.red('actual: ')} ${show(actual)}`);
    console.log('');
    return;
  } 
  if (depth > 0) {
    process.stdout.write(colo.bold('.'));
  }
  Object.keys(diff).forEach((key) => {
    process.stdout.write(colo.bold(`${key}`));
    reason(diff[key], depth + 1);
  });
};

function explain(agreed, actual) {
  if (agreed && actual == null) {
    return 'actual value is undefined, agreed needs some value.';
  }

  if (typeof agreed !== typeof actual) {
    return `mismatch type, agreed type is ${typeof agreed}, but actual type is ${typeof actual}`;
  }

  if (agreed !== actual) {
    return `mismatch value, agreed value is ${agreed}, but actual value is ${actual}`;
  }
}

function show(value) {
  if (value && typeof value === 'object') {
    return JSON.stringify(value);
  }
  return value;
}
