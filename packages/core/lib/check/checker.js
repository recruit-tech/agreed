"use strict";

const isInclude = require("./isInclude");
const url = require("url");
const logger = require("../utils/logger");
const { hasTemplate } = require("../template/hasTemplate");
const tmplBind = require("../template/bind");

const nullishStrings = ["undefined", "null", ""];

class Checker {
  static validRequest(result, request, req, debug) {
    if (!result || !result.error) {
      return true;
    }

    if (debug) {
      logger.log(result.error);
      logger.log("agreed request", request);
      logger.log("actual request", req);
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
    result = Checker.body(request.body, req.body, options);
    similarity += result.similarity;
    if (!Checker.validRequest(result, request, req, options.debug)) {
      return { result: false, similarity, error: result.error };
    }
    // query
    // The value of the given query character.
    result = Checker.query(request.query, req.query, options);
    similarity += result.similarity;
    if (
      !Checker.validRequest(result, request, req, options.debug) ||
      result.similarity == 0
    ) {
      return { result: false, similarity: 0, error: result.error };
    }
    return { result: true, similarity };
  }

  static method(entryMethod, reqMethod) {
    const result = { similarity: 1 };
    if (entryMethod.toLowerCase() !== reqMethod.toLowerCase()) {
      result.type = "METHOD";
      result.error = `Does not match METHOD, expect ${entryMethod}, but ${reqMethod}.`;
      result.similarity = 0;
    }
    return result;
  }

  static url(entryUrl, reqUrl, options) {
    const result = { similarity: 1 };
    const match = entryUrl.exec(reqUrl);
    const { pathToRegexpKeys, values = {} } = options;
    if (!match) {
      result.type = "URL";
      result.error = `Does not match URL, expect ${entryUrl}, but ${reqUrl}.`;
      result.similarity = 0;
      return result;
    }
    const paths = {};
    pathToRegexpKeys.forEach((pathKey, index) => {
      paths[pathKey.name] = match[index + 1];
    });

    let valuesSimilarity = 1;
    if (pathToRegexpKeys.length !== 0) {
      let matched = 0;
      Object.keys(paths).forEach((k) => {
        if (paths[k] === values[k] + "") {
          matched++;
        }
      });
      valuesSimilarity = matched / pathToRegexpKeys.length;
    }

    const nullish = Checker.checkNullish(paths);
    const nullishError = nullish.error;
    const nullishSimilarity = nullish.similarity;
    result.type = "URL";
    result.error = nullishError;
    result.similarity = nullishSimilarity;

    if (result.similarity >= 1) {
      result.similarity += valuesSimilarity;
    }

    return result;
  }

  static headers(entryHeaders, reqHeaders, options) {
    const result = { similarity: 1 };
    if (!entryHeaders) return result;
    if (!isInclude(entryHeaders, reqHeaders)) {
      result.type = "HEADERS";
      result.error = `Does not include header, expect ${JSON.stringify(
        entryHeaders
      )} but ${JSON.stringify(reqHeaders)}`;
      result.similarity = 0;
      return result;
    }

    const nullish = Checker.checkNullish(reqHeaders);
    const nullishError = nullish.error;
    const nullishSimilarity = nullish.similarity;
    if (nullish) {
      result.type = "HEADERS";
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
      result.type = "BODY";
      result.error = `Does not include body, expect ${JSON.stringify(
        entryBody
      )} but ${JSON.stringify(reqBody)}`;
      result.similarity = 0;
    }
    return result;
  }

  static query(entryQuery, reqQuery, options) {
    const result = { similarity: 1 };
    if (!entryQuery) return result;
    if (!isInclude(entryQuery, reqQuery)) {
      result.type = "QUERY";
      result.error = `Does not include query, expect ${JSON.stringify(
        entryQuery
      )} but ${JSON.stringify(reqQuery)}`;
      result.similarity = 0;
    }

    // e.g.)
    // entryQuery = { q: "{:someQueryStrings }" }
    // reqQuery = { q: "bar" }
    const existEntryQuery = Object.keys(entryQuery).length > 0;
    if (existEntryQuery) return this.queryWhenCarefulCheckRequired(reqQuery, entryQuery, options);

    return result;
  }

  static queryWhenCarefulCheckRequired(reqQuery, entryQuery, options) {
    const result = { similarity: 1 };
    const isMatch = Object.keys(reqQuery).every((key) => {
      if (entryQuery[key] != undefined) {
        const tmpl = hasTemplate(entryQuery[key]);
        const hasTmpl = tmpl !== null && tmpl.length > 0;
        const reqValue = reqQuery[key];

        if (hasTmpl) {
          // e.g.) {":someQueryStrings"} => someQueryStrings
          const normalizedKey = entryQuery[key].replace(/\{|\}|\:/g, "");
          return this.matchQueryWhenHasTmpl(
            reqQuery,
            entryQuery,
            options,
            reqValue,
            normalizedKey
          );
        } else {
          // e.g.) entryQuery = { foo: "foo", bar: "bar" }
          // e.g.) entryParameters = { id: "yosuke" }
          const entryQueryValue = entryQuery[key];
          return reqValue === entryQueryValue;
        }
      } else {
        // An undefined query string may have been passed
        return false;
      }
    });

    result.similarity = isMatch ? 1 : 0;
    return result;
  }

  static matchQueryWhenHasTmpl(reqQuery, entryQuery, options, reqValue, normalizedKey) {
    // e.g.) { "someQueryStrings": "bar" }
    const calcEntryParameters = tmplBind(entryQuery, reqQuery);
    const calcEntryQueryValue = calcEntryParameters[normalizedKey];

    // e.g.) { id: "yosuke", someQueryStrings: "bar" }
    // include path parameters
    const entryParameters = options.values;

    // Consideration when the query string is given in the path
    //
    // e.g.)
    // path = "/test/arrayreqs/agreed/values?year_months[]=201708&year_months[]=201709&year_months[]=201810"
    // options = { pathToRegexpKeys: [], values: undefined, debug: undefined }
    if (entryParameters !== undefined) {
      const entryQueryValue = entryParameters[normalizedKey];

      // By definition, it can be defined as a numerical value, but in reality, only a numerical value as a character string can be passed.
      return (
        calcEntryQueryValue == String(entryQueryValue) &&
        reqValue === String(entryQueryValue)
      );
    } else {
      return reqValue == calcEntryQueryValue;
    }
  }

  static checkNullish(obj = {}) {
    const result = { similarity: 1 };
    const keys = Object.keys(obj);
    for (var i = 0; i < keys.length; i++) {
      const key = keys[i];
      const realValue = obj[key];

      if (typeof realValue === "object" && realValue) {
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
