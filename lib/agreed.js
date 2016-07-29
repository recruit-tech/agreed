'use strict';
const Context = require("./context");
const express = require("express");

class Agreed {
  middleware(options) {
    this.context = new Context(options);
    return (req, res, next) => {
      this.context.useMiddleware(req, res, next);
    }
  }
}

module.exports = new Agreed();
