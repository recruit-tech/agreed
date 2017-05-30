'use strict';

// wrapper for request executor
module.exports = (client, agrees) => {
  return new Promise((resolve, reject) => {
    const requests = client.createRequests(agrees);
    const results = [];
    requests.forEach((request, i) => {
      request.end();
      request.on('response', (response) => {
      throw new Error('eeee');
        client.checkResponse(response, agrees[i]).on('result', (result) => {
          results.push(result);
          if (results.length === requests.length) {
            return resolve(results);
          }
        });
      });
      request.on('error', reject);
    });
  });
};
