'use strict';

const agreed = require('agreed-core');
const filter = require('./lib/filter');
const requestPromise = require('./lib/requestPromise');
const reporter = require('./lib/reporter');

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

  const client = agreed.createClient(opts);
  const agrees = filter(client.getAgreement(), opts.filter);

  const request = requestPromise(client, agrees);
  const repo = reporter(agrees);

  return {
    // low level api
    client,
    agrees,
    
    // high level api
    request,
    reporter: repo,
  };
};
