'use strict';

const url = require('url');
const qs = require('querystring');
const pathToRegexp = require('path-to-regexp');
const format = require('../template/format');

module.exports.incomingRequst = (req) => {
  return new Promise((resolve, reject) => {
    const result = {};

    const urlObj = url.parse(req.url);
    result.method = req.method;
    result.path = urlObj.pathname;
    result.query = qs.parse(urlObj.query);
    result.url = req.url;
    result.headers = req.headers;

    if (req.body) {
      result.body = req.body;
      return resolve(result);
    }

    // has some body contents
    if (req.headers && req.headers['content-length']) {
      var data = '';
      req.on('readable', () => {
        const chunk = req.read();
        if (chunk) {
          data += chunk;
        } 
      });
      req.on('end', () => {
        result.body = JSON.parse(data);
        resolve(result);
      });
      req.on('error', reject);
    } else { 
      return resolve(result);
    }
  });
};

module.exports.outgoingRequest = (req, opts) => {
  const result = {};
  result.path = req.path.indexOf(':') >= 0 ? tryCompilePath(req.path, req.values) : req.path;
  const query = req.query && qs.stringify(format(req.query, req.values));
  if (query) {
    result.path += `?${query}`;
  }
  result.method = req.method;
  result.headers = (req.headers && format(req.headers, req.values)) || {};
  result.host = opts.host;
  result.port = opts.port;
  return result;
};

function tryCompilePath(path, values) {
  try {
    return pathToRegexp.compile(path)(values);
  } catch (e) {
    return path.replace(/:/g, '');
  }
}
