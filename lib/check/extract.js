const url = require('url');
const qs = require('querystring');
const pathToRegexp = require('path-to-regexp');

module.exports.incomingRequst = (req) => {
  return new Promise((resolve, reject) => {
    const result = req;

    const urlObj = url.parse(req.url);
    result.method = req.method;
    result.url = urlObj.pathname;
    result.query = qs.parse(urlObj.query);

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
  result.path = req.url.indexOf(':') >= 0 ? tryCompilePath(req.url, req.value) : req.url;
  const query = req.query && qs.stringify(req.query);
  if (query) {
    result.path += `?${query}`;
  }
  result.method = req.method;
  result.headers = req.headers || {};
  result.host = opts.host;
  result.port = opts.port;
  return result;
};

function tryCompilePath(path, value) {
  try {
    return pathToRegexp.compile(path)(value);
  } catch (e) {
    return path.replace(/:/g, '');
  }
}
