'use strict';
const pathToRegexp = require('path-to-regexp');
const path = require('path');

const DEFAULT_REQUEST = require('./defaultRequest');
const DEFAULT_RESPONSE = require('./defaultResponse');
const isAbsolutePath = require('./isAbsolutePath');

module.exports = (agree, base) => {
  if (typeof agree === 'string') {
    agree = normalizedRequire(agree, base);
  }

  if (!agree) {
    throw new Error(`[agreed] agree object is not found`);
  }

  if (typeof agree.request === 'string') {
    agree.request = normalizedRequire(agree.request, base);
  }

  if (typeof agree.response === 'string') {
    agree.response = normalizedRequire(agree.response, base);
  }


  if (!agree.request) {
    throw new Error(`[agreed] resquest object is required ${JSON.stringify(agree)}`);
  }

  if (!agree.response) {
    throw new Error(`[agreed] response object is required ${JSON.stringify(agree)}`);
  }

  if (!agree.request.path) {
    throw new Error(`[agreed] request path is required ${JSON.stringify(agree.request)}`);
  }

  if (!agree.request.method) {
    agree.request.method = DEFAULT_REQUEST.method;
  }

  if (typeof agree.request.path !== 'string') {
    throw new Error(`[agreed] request path must be string ${JSON.stringify(agree.request)}`);
  }

  if (typeof agree.request.method !== 'string') {
    throw new Error(`[agreed] request method must be string ${JSON.stringify(agrre.reqest)}`);
  }

  agree.request.pathToRegexpKeys = []; 

  agree.request.pathToRegexp = pathToRegexp(agree.request.path, agree.request.pathToRegexpKeys); 

  if (!agree.response.status) {
    agree.response.status = DEFAULT_RESPONSE.status;
  }
  if (!agree.response.headers) {
    agree.response.headers = DEFAULT_RESPONSE.headers;
  }

  Object.keys(DEFAULT_RESPONSE.headers).forEach((header) => {
    agree.response.headers[header] = agree.response.headers[header] || DEFAULT_RESPONSE.headers[header];
  });

  return agree;
};

function normalizedRequire(file, base) {
  return path.isAbsolute(file) ? require(file) : require(path.join(base, file));
}
