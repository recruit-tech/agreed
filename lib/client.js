'use strict';

const http = require('http');
const https = require('https');
const path = require('path');
const url = require('url');
const Checker = require('./check/checker');
const CheckBodyStream = require('./check/CheckBodyStream');
const completion = require('./check/completion');
const extract = require('./check/extract');
const isContentJSON = require('./check/isContentJSON');
const register = require('./register');
const format = require('./template/format');
const requireUncached = require('./require_hook/requireUncached');

class Client {
  constructor(options = {}) {
    this.agreesPath = path.resolve(options.path);
    this.base = path.dirname(this.agreesPath);
    this.scheme = options.scheme || 'http';
    this.host = options.host || 'localhost';
    this.port = options.port || 80;
    this.options = options;
    register();
  }

  getAgreement() {
    const agrees = [].concat(requireUncached(this.agreesPath));
    return this.completion(agrees);
  }


  setup(agree) {
    if (typeof agree !== 'object' && agree) {
      throw new TypeError('agree should be object');
    }
    const options = extract.outgoingRequest(agree.request, this);
    const hasContentJSON = isContentJSON(agree.request);
    const content = hasContentJSON ? JSON.stringify(format(agree.request.body, agree.request.values)) : agree.request.body;
    const contentLength = content ? Buffer.byteLength(content) : 0;
    options.headers['Content-Length'] = contentLength;
    options.headers['Content-Type'] = (agree.request.headers && agree.request.headers['Content-Type']) || 'application/json';
    return { options, content, contentLength };
  }

  createRequest(setting) {
    if (typeof setting !== 'object' && setting) {
      throw new TypeError('setting should be object');
    }
    const { options, content, contentLength } = setting;
    const scheme = this.scheme === 'https' ? https : http;
    const request = scheme.request(options);
    contentLength && request.write(content);
    request.agreed = {
      options,
      content,
      contentLength,
    };
    return request;
  }

  createRequests(agrees) {
    const completedAgrees = this.completion(agrees);
    const requests = completedAgrees.map((agree) => {
      const setting = this.setup(agree);
      return this.createRequest(setting);
    });
    return requests;
  }

  checkResponse(response, agree) {
    const completedAgree = completion(agree, this.base);
    const isSameStatus = completedAgree.response.status == response.statusCode;
    const checkStream = new CheckBodyStream();
    checkStream.expect(completedAgree.response.body);
    checkStream.schema(completedAgree.response.schema);
    return response.pipe(checkStream).on('checked', (result) => {
      if (!isSameStatus) {
        result.status = [completedAgree.response.status, response.statusCode];
      }
      checkStream.emit('result', result);
    });
  }

  completion(agrees) {
    return agrees.map((agree) => completion(agree, this.base));
  }
}

module.exports = Client;
