'use strict';

const http = require('http');
const https = require('https');
const path = require('path');
const url = require('url');
const Checker = require('./check/checker');
const completion = require('./check/completion');
const extract = require('./check/extract');
const isContentJSON = require('./check/isContentJSON');
const register = require('./register');
const format = require('./template/format');

class Client {
  constructor(options) {
    this.agreesPath = path.resolve(options.path);
    this.base = path.dirname(this.agreesPath);
    this.scheme = options.scheme || 'http';
    this.host = options.host || 'localhost';
    this.port = options.port || 3000;
    register();
  }

  executeAgreement(agrees) {
    agrees = agrees.map((agree) => completion(agree, this.base));
    const resultsPromise = agrees.map((agree) => {
      const options = extract.outgoingRequest(agree.request, this);
      const hasContentJSON = isContentJSON(agree.request);
      const content = hasContentJSON ? JSON.stringify(agree.request.body) : agree.request.body
      const contentLength = content ? Buffer.byteLength(content) : 0;
      options.headers['Content-Length'] = contentLength;
      options.headers['Content-Type'] = (agree.request.headers && agree.request.headers['Content-Type']) || 'application/json';
      const protocol = this.scheme === 'http' ? http : https;

      if (agree.response.body) {
        agree.response.body = JSON.parse(format(JSON.stringify(agree.response.body), agree.request.values));
      }

      return new Promise((resolve, reject) => {
        const req = protocol.request(options, resolve);
        req.on('error', reject);
        content && req.write(content);
        req.end();
      });

    });
    return resultsPromise;
  }
}

module.exports = Client;
