'use strict';

const Agreed = require('agreed-core');
const filter = require('./lib/filter');
const requestPromise = require('./lib/requestPromise');
const agreedReporter = require('./lib/reporter');

module.exports = (opts) => {
  if (!opts) {
    throw new Error('[agreed-client] option is required.');
  }

  if (!opts.path) {
    throw new Error('[agreed-client] option.path is required.');
  }

  opts.scheme = opts.scheme || 'http';
  opts.host = opts.host || 'localhost';
  opts.port = opts.port || 80;

  const agreed = new Agreed();
  const client = agreed.createClient(opts);
  const agrees = filter(client.getAgreement(), opts.filter);
  client.requestPromise = requestPromise;
  const reporter = agreedReporter(agrees);

  return {
    client,
    agrees,
    reporter,
  };
};
