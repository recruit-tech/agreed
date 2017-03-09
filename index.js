'use strict';
const express = require('express');
const bodyParser = require('body-parser');
const agreed = require('agreed-core');
const app = express();

module.exports = (opts) => {
  if (!opts) {
    throw new Error('[agreed-server] option is required.');
  }

  if (!opts.path) {
    throw new Error('[agreed-server] option.path is required.');
  }

  const port = opts.port || 3000;

  app.use(bodyParser.json());

  if (opts.middlewares) {
    if (!Array.isArray(opts.middlewares)) {
      throw new Error('[agreed-server] option.middlewares must be an array.');
    }
    opts.middlewares.forEach((fn) => {
      app.use(fn);
    });
  }

  app.use(agreed.middleware(opts));
  app.use((err, req, res, next) => {
    res.statusCode = 500;
    res.send(`Error is occurred : ${err}`);
  });
  return app.listen(opts.port);
};

