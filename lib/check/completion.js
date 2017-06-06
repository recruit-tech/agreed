'use strict';

const pathToRegexp = require('path-to-regexp');
const path = require('path');
const requireUncached = require('../require_hook/requireUncached');

const DEFAULT_REQUEST = require('./defaultRequest');
const DEFAULT_RESPONSE = require('./defaultResponse');

module.exports = (agree, base, opts = {}) => {
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

  if (!agree.request.headers) {
    agree.request.headers = DEFAULT_REQUEST.headers;
  } else {
    agree.request.headers = Object.assign({}, DEFAULT_REQUEST.headers, agree.request.headers);
  }

  if (opts.defaultRequestHeaders) {
    agree.request.headers = Object.assign({}, opts.defaultRequestHeaders, agree.request.headers);
  }

  agree.request.headers = toLowerCaseKeys(agree.request.headers); 

  if (!agree.response.status) {
    agree.response.status = DEFAULT_RESPONSE.status;
  }

  if (!agree.response.headers) {
    agree.response.headers = DEFAULT_RESPONSE.headers;
  } else {
    agree.response.headers = Object.assign({}, DEFAULT_RESPONSE.headers, agree.response.headers);
  }

  if (opts.defaultResponseHeaders) {
    agree.response.headers = Object.assign({}, opts.defaultResponseHeaders, agree.response.headers);
  }


  agree.response.body = agree.response.body || DEFAULT_RESPONSE.body;

  if (typeof agree.response.schema === 'string') {
    agree.response.schema = normalizedRequire(agree.response.schema, base);
  }

  return agree;
};

function normalizedRequire(file, base) {
  return path.isAbsolute(file) ? requireUncached(file) : requireUncached(path.join(base, file));
}

function toLowerCaseKeys(obj) {
  const keys = Object.keys(obj);
  const result = {};

  keys.forEach((key) => {
    result[key.toLowerCase()] = obj[key];
  });
  return result;
} 
