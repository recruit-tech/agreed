'use strict';
const Server = require("./server");
const Client = require("./client");

class Agreed {
  middleware(options) {
    this.server = new Server(options);
    return (req, res, next) => {
      this.server.useMiddleware(req, res, next);
    }
  }
  createClient(options) {
    this.client = new Client(options);
    return this.client;
  }
}

module.exports = Agreed;
