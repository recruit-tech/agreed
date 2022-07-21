"use strict";

const path = require("path");
const url = require("url");
const stable = require("stable");
const Checker = require("./check/checker");
const completion = require("./check/completion");
const extract = require("./check/extract");
const isContentJSON = require("./check/isContentJSON");
const register = require("./register");
const format = require("./template/format");
const hasTemplate = require("./template/hasTemplate").hasTemplate;
const bind = require("./template/bind");
const requireAgree = require("./require_hook/requireAgree");
const EventEmitter = require("events").EventEmitter;

class Server {
  constructor(options = {}) {
    this.agrees = options.agrees;
    if (!options.agrees) {
      this.agreesPath = require.resolve(path.resolve(options.path));
      this.base = path.dirname(this.agreesPath);
    }
    this.options = options;
    this.notifier = new EventEmitter();
    const registerOpts = { 
      typedCachePath: options.typedCachePath,
      ...this.options.register,
    };
    register(registerOpts, this.options.hot);
  }
  useMiddleware(req, res, next) {
    const agrees = (
      this.agrees || requireAgree(this.agreesPath, this.options.hot)
    ).map(agree => completion(agree, this.base, this.options));

    extract
      .incomingRequest(req)
      .then(req => {
        const agreesWithResults = stable(
          agrees.map(agree => {
            const { result, similarity, error } = Checker.request(
              agree.request,
              req,
              {
                pathToRegexpKeys: agree.request.pathToRegexpKeys,
                values: agree.request.values,
                debug: this.options.debug,
                enablePreferQuery: this.options.enablePreferQuery,
                skipCheckHeaderValueNullable: this.options.skipCheckHeaderValueNullable,
              }
            );
            return { agree, result, similarity, error };
          }),
          (a, b) => b.similarity - a.similarity
        );

        if (
          this.options.strict &&
          agreesWithResults.filter(({ result }) => result).length > 1
        ) {
          res.header("Content-Type", "application/json", "charset=utf-8");
          res.statusCode = 500;
          res.end(
            JSON.stringify(
              {
                message: "Ambiguous Request",
                candidates: agreesWithResults
                  .filter(({ result }) => result)
                  .map(({ agree: { request, response } }) => {
                    delete request.pathToRegexpKeys;
                    delete request.pathToRegexp;
                    delete response.pathToRegexpKeys;
                    delete response.pathToRegexp;
                    return { request, response };
                  })
              },
              null,
              2
            )
          );
          return;
        }

        const result = agreesWithResults.find(({ result }) => result);

        if (!result || !result.agree) {
          if (this.options.callNextWhenNotFound) {
            typeof next === "function" && next();
            return;
          }
          res.statusCode = 404;
          const { agree, similarity, error } = agreesWithResults.shift();

          if (similarity > 1) {
            delete agree.request.pathToRegexp;
            delete agree.request.pathToRegexpKeys;
            res.end(
              `Agree Not Found, actual request is ${JSON.stringify(
                req, null, 2
              )}, but similar agree request is ${JSON.stringify(
                agree.request, null, 2
              )}, error: ${error}`
            );
          } else {
            res.end(`Agree Not Found`);
          }

          typeof next === "function" && next();
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

        if (
          agree.request.headers &&
          hasTemplate(JSON.stringify(agree.request.headers))
        ) {
          agree.request.values = Object.assign(
            {},
            agree.request.values,
            bind(agree.request.headers, req.headers)
          );
        }

        if (
          agree.request.query &&
          hasTemplate(JSON.stringify(agree.request.query))
        ) {
          agree.request.values = Object.assign(
            {},
            agree.request.values,
            bind(agree.request.query, req.query)
          );
        }

        if (
          agree.request.body &&
          hasTemplate(JSON.stringify(agree.request.body))
        ) {
          agree.request.values = Object.assign(
            {},
            agree.request.values,
            bind(agree.request.body, req.body)
          );
        }

        res.statusCode = format(agree.response.status, agree.request.values);

        let messageBody = agree.response.body || "";

        if (agree.request.values) {
          messageBody = format(
            messageBody,
            agree.request.values,
            agree.response.funcs
          );
        }

        if (agree.response.values) {
          messageBody = format(
            messageBody,
            Object.assign({}, agree.response.values, agree.request.values),
            agree.response.funcs
          );
        }

        if (isContentJSON(agree.response)) {
          messageBody = JSON.stringify(messageBody);
        }

        Object.keys(agree.response.headers).forEach(header => {
          res.setHeader(
            header,
            format(
              agree.response.headers[header],
              Object.assign(
                {},
                agree.response.values || {},
                agree.request.values || {}
              ),
              agree.response.funcs
            )
          );
        });

        if (agree.response.notify) {
          const notify = format(
            agree.response.notify.body,
            Object.assign(
              {},
              agree.response.values || {},
              agree.request.values || {}
            ),
            agree.response.funcs
          );
          this.notifier.emit(agree.response.notify.event || "message", notify);
        }

        res.end(messageBody);
        if (agree.request.values) {
          delete agree.request.values;
        }
      })
      .catch(e => {
        typeof next === "function" && next(e);
        process.nextTick(() => {
          throw e;
        });
      });
  }
}

module.exports = Server;
