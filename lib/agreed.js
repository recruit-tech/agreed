'use strict';
const Context = require("./context");
const Client = require("./client");
const express = require("express");

class Agreed {
  middleware(options) {
    this.context = new Context(options);
    return (req, res, next) => {
      this.context.useMiddleware(req, res, next);
    }
  }
  client(options) {
    this.client = new Client(options);
    return this.client;
  }
}

module.exports = new Agreed();
