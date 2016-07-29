const url = require('url');
const qs = require('querystring');

module.exports = (req) => {
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

