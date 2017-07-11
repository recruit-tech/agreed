'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const Agreed = require('../../index');
const agreed = new Agreed();
const app = express();

module.exports = (opts) => {
  app.use(bodyParser.json());
  app.use(agreed.middleware(opts));
  app.use((err, req, res, next) => {
    res.statusCode = 500;
    res.send(`Error is occurred : ${err}`);
  });
  return { server: app.listen(opts.port), notifier: agreed.server.notifier };
};



