'use strict';

const path = require('path');
const url = require('url');
const Checker = require('./check/checker');
const completion = require('./check/completion');
const extract = require('./check/extract');
const isContentJSON = require('./check/isContentJSON');
const register = require('./register');

class Context {
  constructor(options) {
    this.agreesPath = path.resolve(options.path);
    this.base = path.dirname(this.agreesPath);
    register();
  }

  useMiddleware(req, res, next) {
    const agrees = require(this.agreesPath).map((agree) => completion(agree, this.base));

    extract.incomingRequst(req).then((req) => {
      const agree = agrees.find((agree) => Checker.request(agree.request, req));

      if (!agree) {
        res.statusCode = 404;
        res.end('Not Agree Found');
        typeof next === 'function' && next();
        return;
      }

      res.statusCode = agree.response.status;
      Object.keys(agree.response.headers).forEach((header) => {
        res.setHeader(header, agree.response.headers[header]);
      });

      const messageBody = agree.response.body || '';

      if (isContentJSON(agree.response)) {
        return res.end(JSON.stringify(agree.response.body));
      }

      res.end('' + agree.response.body);
    }).catch((e) => {
      typeof next === 'function' && next(e);
      process.nextTick(() => {
        throw e;
      });
    });
  }

}

module.exports = Context;
