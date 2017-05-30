'use strict';

const isInclude = require('./isInclude');
const url = require("url");
const logger = require("../utils/logger");

const nullishStrings = ['undefined', 'null', ''];

class Checker {

  static validRequest(result, request, req, debug) {
    if (!result || !result.error) {
      return true;
    }

    if (debug) {
      logger.log(result.error);
      logger.log('agreed request', request);
      logger.log('actual request', req);
    }

    return false;
  }

  static request(request, req, options) {
    const parsedUrl = url.parse(req.url);
    let similarity = 0;
    let result = Checker.method(request.method, req.method);
    similarity += result.similarity;
    if (!Checker.validRequest(result, request, req, options.debug)) {
      return { result: false, similarity, error: result.error };
    }
    result = Checker.url(request.pathToRegexp, parsedUrl.pathname, options);
    similarity += result.similarity;
    if (!Checker.validRequest(result, request, req, options.debug)) {
      return { result: false, similarity, error: result.error };
    }
    result = Checker.headers(request.headers, req.headers, options);
    similarity += result.similarity;
    if (!Checker.validRequest(result, request, req, options.debug)) {
      return { result: false, similarity, error: result.error };
    }
    result = Checker.query(request.query, req.query, options);
    similarity += result.similarity;
    if (!Checker.validRequest(result, request, req, options.debug)) {
      return { result: false, similarity, error: result.error };
    }
    result = Checker.body(request.body, req.body, options);
    similarity += result.similarity;
    if (!Checker.validRequest(result, request, req, options.debug)) {
      return { result: false, similarity, error: result.error };
    }
    return { result: true };
  }

  static method(entryMethod, reqMethod) {
    const result = { similarity: 1 };
    if (entryMethod.toLowerCase() !== reqMethod.toLowerCase()) {
      result.type = 'METHOD';
      result.error = `Does not match METHOD, expect ${entryMethod}, but ${reqMethod}.`;
      result.similarity = 0;
    }
    return result;
  }

  static url(entryUrl, reqUrl, options) {
    const result = { similarity: 1 };
    const match = entryUrl.exec(reqUrl);
    const { pathToRegexpKeys, values } = options;
    if (!match) {
      result.type = 'URL';
      result.error = `Does not match URL, expect ${entryUrl}, but ${reqUrl}.`;
      result.similarity = 0;
      return result;
    }
    const paths = {};
    pathToRegexpKeys.forEach((pathKey, index) => {
      paths[pathKey.name] = match[index + 1];
    });

    const nullish = Checker.checkNullish(paths);
    const nullishError = nullish.error;
    const nullishSimilarity = nullish.similarity;
    if (nullish) {
      result.type = 'URL';
      result.error = nullishError;
      result.similarity = nullishSimilarity;
      return result;
    }

    return result;
  }

  static headers(entryHeaders, reqHeaders, options) {
    const result = { similarity: 1 };
    if (!entryHeaders) return result;
    if (!isInclude(entryHeaders, reqHeaders)) {
      result.type = 'HEADERS';
      result.error = `Does not include header, expect ${JSON.stringify(entryHeaders)} but ${JSON.stringify(reqHeaders)}`;
      result.similarity = 0;
      return result;
    }

    const nullish = Checker.checkNullish(reqHeaders);
    const nullishError = nullish.error;
    const nullishSimilarity = nullish.similarity;
    if (nullish) {
      result.type = 'HEADERS';
      result.error = nullishError;
      result.similarity = nullishSimilarity;
      return result;
    }
    return result;
  }

  static body(entryBody, reqBody, options) {
    const result = { similarity: 1 };
    if (!entryBody) return result;
    if (!isInclude(entryBody, reqBody)) {
      result.type = 'BODY';
      result.error = `Does not include body, expect ${JSON.stringify(entryBody)} but ${JSON.stringify(reqBody)}`;
      result.similarity = 0;
    }
    return result;
  }

  static query(entryQuery, reqQuery, options) {
    const result = { similarity: 1 };
    if (!entryQuery) return result;
    if (!isInclude(entryQuery, reqQuery)) {
      result.type = 'QUERY';
      result.error = `Does not include query, expect ${JSON.stringify(entryQuery)} but ${JSON.stringify(reqQuery)}`;
      result.similarity = 0;
    }
    return result;
  }

  static checkNullish(obj = {}) {
    const result = { similarity: 1 };
    const keys = Object.keys(obj);
    for (var i=0; i<keys.length; i++) {
      const key = keys[i];
      const realValue = obj[key];

      if (typeof realValue === 'object' && realValue) {
        return Checker.checkNullish(realValue);
      }

      if (nullishStrings.indexOf(realValue) >= 0) {
        result.error = `Request value has nullish strings ${realValue} in ${key}`;
        result.similarity = 0.5;
        return result;
      }
    }
    return result;
  }
}

module.exports = Checker;
