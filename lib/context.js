'use strict';

const path = require('path');
const url = require('url');
const Checker = require('./check/checker');
const completion = require('./check/completion');
const extract = require('./check/extract');
const isContentJSON = require('./check/isContentJSON');
const register = require('./register');
const format = require('./template/format');
const hasTemplate = require('./template/hasTemplate');
const bind = require('./template/bind');
const requireUncached = require('./require_hook/requireUncached');

class Context {
  constructor(options) {
    this.agreesPath = path.resolve(options.path);
    this.base = path.dirname(this.agreesPath);
    register();
  }

  useMiddleware(req, res, next) {
    const agrees = requireUncached(this.agreesPath).map((agree) => completion(agree, this.base));

    extract.incomingRequst(req).then((req) => {
      const agree = agrees.find((agree) => Checker.request(agree.request, req));

      if (!agree) {
        res.statusCode = 404;
        res.end('Agree Not Found');
        typeof next === 'function' && next();
        return;
      }

      if (agree.request.pathToRegexpKeys.length > 0) {
        const pathname = url.parse(req.url).pathname;
        const result = agree.request.pathToRegexp.exec(pathname);
        const values = {};
        agree.request.pathToRegexpKeys.forEach((pathKey, index) => {
          values[pathKey.name] = result[index + 1];
        });
        agree.request.values = values;
      }

      if (agree.request.query && hasTemplate(JSON.stringify(agree.request.query))) {
        agree.request.values = Object.assign(agree.request.values, bind(agree.request.query, req.query));
      }

      if (agree.request.body && hasTemplate(JSON.stringify(agree.request.body))) {
        agree.request.values = Object.assign(agree.request.values, bind(agree.request.body, req.body));
      }

      res.statusCode = agree.response.status;
      Object.keys(agree.response.headers).forEach((header) => {
        res.setHeader(header, agree.response.headers[header]);
      });

      let messageBody = agree.response.body || '';
      if (isContentJSON(agree.response)) {
        messageBody = JSON.stringify(messageBody);
      }

      if (agree.request.values) {
        messageBody = format(messageBody, agree.request.values);
      }
      res.end(messageBody);
    }).catch((e) => {
      typeof next === 'function' && next(e);
      process.nextTick(() => {
        throw e;
      });
    });
  }

}

module.exports = Context;
