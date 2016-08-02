const isInclude = require('./isInclude');
const url = require("url");


class Checker {
  static request(request, req) {
    const parsedUrl = url.parse(req.url);
    return request.method === "*" ? true : request.method.toLowerCase() === req.method.toLowerCase() &&
      Checker.url(request.pathToRegexp, parsedUrl.pathname) &&
      Checker.headers(request.headers, req.headers) &&
      Checker.query(request.query, req.query) &&
      Checker.body(request.body, req.body);
  }

  static url(entryUrl, reqUrl) {
    return entryUrl.exec(reqUrl) ? true : false;
  }

  static headers(entryHeaders, reqHeaders) {
    if (!entryHeaders) return true;
    return isInclude(entryHeaders, reqHeaders);
  }

  static body(entryBody, reqBody) {
    if (!entryBody) return true;
    return isInclude(entryBody, reqBody);
  }

  static query(entryQuery, reqQuery) {
    if (!entryQuery) return true;
    return isInclude(entryQuery, reqQuery);
  }
}

module.exports = Checker;
