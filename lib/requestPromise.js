'use strict';

// wrapper for request executor
module.exports = function(agrees) {
  return new Promise((resolve, reject) => {
    const requests = this.createRequests(agrees);
    const results = [];
    requests.forEach((request, i) => {
      request.on('response', (response) => {
        this.checkResponse(response, agrees[i]).on('result', (result) => {
          results[i] = result;
          if (results.filter(Boolean).length === requests.length) {
            return resolve(results);
          }
        });
      });
      request.on('error', reject);
      request.end();
    });
  });
};
