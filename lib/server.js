'use strict';

const path = require('path');
const url = require('url');
const Checker = require('./check/checker');
const completion = require('./check/completion');
const extract = require('./check/extract');
const isContentJSON = require('./check/isContentJSON');
const register = require('./register');
const format = require('./template/format');
const hasTemplate = require('./template/hasTemplate').hasTemplate;
const bind = require('./template/bind');
const requireUncached = require('./require_hook/requireUncached');

class Server {
  constructor(options = {}) {
    this.agreesPath = path.resolve(options.path);
    this.base = path.dirname(this.agreesPath);
    this.options = options;
    this.defaultHeaders = options.defaultHeaders;
    register();
  }

  useMiddleware(req, res, next) {
    const agrees = requireUncached(this.agreesPath).map((agree) => completion(agree, this.base));

    extract.incomingRequst(req).then((req) => {
      const agreesWithResults = agrees.map((agree) => {
        const { result, similarity, error } = Checker.request(agree.request, req, {
          pathToRegexpKeys: agree.request.pathToRegexpKeys,
          values: agree.request.values,
          debug: this.options.debug,
        });
        return { agree, result, similarity, error };
      });

      const result = agreesWithResults.find(({ result }) => result);

      if (!result || !result.agree) {
        res.statusCode = 404;
        const { agree, result, similarity, error } = 
          agreesWithResults.sort((a, b) => b.similarity - a.similarity).shift();

        if (similarity > 1) {
          delete agree.request.pathToRegexp;
          delete agree.request.pathToRegexpKeys;
          res.end(`Agree Not Found, actual request is ${JSON.stringify(req)}, but similar agree request is ${JSON.stringify(agree.request)}, error: ${error}`);
        } else {
          res.end(`Agree Not Found`);
        }

        typeof next === 'function' && next();
        return;
      }

      const { agree } = result;

      // /foo/:id matched
      if (agree.request.pathToRegexpKeys.length > 0) {
        const pathname = url.parse(req.url).pathname;
        const result = agree.request.pathToRegexp.exec(pathname);
        const values = {};
        agree.request.pathToRegexpKeys.forEach((pathKey, index) => {
          values[pathKey.name] = result[index + 1];
        });
        agree.request.values = values;
      }

      if (agree.request.headers && hasTemplate(JSON.stringify(agree.request.headers))) {
        agree.request.values = Object.assign(agree.request.values, bind(agree.request.headers, req.headers));
      }

      if (agree.request.query && hasTemplate(JSON.stringify(agree.request.query))) {
        agree.request.values = Object.assign(agree.request.values, bind(agree.request.query, req.query));
      }

      if (agree.request.body && hasTemplate(JSON.stringify(agree.request.body))) {
        agree.request.values = Object.assign(agree.request.values, bind(agree.request.body, req.body));
      }

      res.statusCode = agree.response.status;

      let messageBody = agree.response.body || '';

      if (agree.request.values) {
        messageBody = format(messageBody, agree.request.values);
      }

      if (agree.response.values) {
        messageBody = format(messageBody, Object.assign(agree.response.values, agree.request.values));
      }

      if (isContentJSON(agree.response)) {
        messageBody = JSON.stringify(messageBody);
      }

      if (this.defaultHeaders && agree.response.headers) {
        agree.response.headers = Object.assign(agree.response.headers, this.defaultHeaders);
      }

      Object.keys(agree.response.headers).forEach((header) => {
        res.setHeader(header, format(agree.response.headers[header], Object.assign(agree.response.values || {}, agree.request.values || {})));
      });

      res.end(messageBody);
    }).catch((e) => {
      typeof next === 'function' && next(e);
      process.nextTick(() => {
        throw e;
      });
    });
  }

}

module.exports = Server;
