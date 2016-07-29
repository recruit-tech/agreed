const deepEqual = require('deep-equal');
const isInclude = require('./isInclude');
const url = require("url");


class Checker {
  static request(request, req, deep) {
    const parsedUrl = url.parse(req.url);
    return request.method === "*" ? true : request.method.toLowerCase() === req.method.toLowerCase() &&
      Checker.url(request.pathToRegexp, parsedUrl.pathname) &&
      Checker.headers(request.headers, req.headers, deep) &&
      Checker.query(request.query, req.query, deep) &&
      Checker.body(request.body, req.body, deep);
  }

  static url(entryUrl, reqUrl) {
    return entryUrl.exec(reqUrl) ? true : false;
  }

  static headers(entryHeaders, reqHeaders, deep) {
    if (!entryHeaders) return true;
    return deep ? deepEqual(entryHeaders, reqHeaders) : isInclude(entryHeaders, reqHeaders);
  }

  static body(entryBody, reqBody, deep) {
    if (!entryBody) return true;
    return deep ? deepEqual(entryBody, reqBody) : isInclude(entryBody, reqBody);
  }

  static query(entryQuery, reqQuery, deep) {
    if (!entryQuery) return true;
    return deep ? deepEqual(entryQuery, reqQuery) : isInclude(entryQuery, reqQuery);
  }
}

module.exports = Checker;
