'use strinct';
const express = require('express');
const bodyParser = require('body-parser');
const agreed = require('../../index');
const app = express();

module.exports = (opts) => {
  app.use(bodyParser.json());
  app.use(agreed.middleware(opts));
  app.use((err, req, res, next) => {
    res.statusCode = 500;
    res.send(`Error is occurred : ${err}`);
  });
  return app.listen(opts.port);
};


