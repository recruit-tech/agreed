'use strict';
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const Agreed = require('agreed-core');
const httpProxy = require('express-http-proxy');
const morgan = require('morgan');

module.exports = (opts) => {
  if (!opts) {
    throw new Error('[agreed-server] option is required.');
  }

  if (!opts.path) {
    throw new Error('[agreed-server] option.path is required.');
  }

  const app = express();
  const port = opts.port || 3000;
  const stat = opts.static;
  const staticPrefixPath = opts['static-prefix-path'] || opts.staticPrefixPath;
  const proxy = opts.proxy;
  const proxyPrefixPath = opts['proxy-prefix-path'] || opts.proxyPrefixPath;
  const proxyOpts = opts.proxyOpts || {};

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  
  if (stat) {
    if (staticPrefixPath) {
      app.use(staticPrefixPath, express.static(path.join(process.cwd(), stat)));
    } else {
      app.use(express.static(path.join(process.cwd(), stat)));
    }
  }

  if (proxy) {
    if (proxyPrefixPath) {
      app.use(proxyPrefixPath, httpProxy(proxy, proxyOpts));
    } else {
      app.use(httpProxy(proxy, proxyOpts));
    }
  }

  if (opts.middlewares) {
    if (!Array.isArray(opts.middlewares)) {
      throw new Error('[agreed-server] option.middlewares must be an array.');
    }
    opts.middlewares.forEach((fn) => {
      app.use(fn);
    });
  }

  if (opts.logging) {
    app.use(morgan('tiny'));
  }

  const agreed = new Agreed();
  app.use(agreed.middleware(opts));

  const createServer = (appServer = app) => {
    appServer.use((err, req, res, next) => {
      res.statusCode = 500;
      res.send(`Error is occurred : ${err}`);
    });
    const server = appServer.listen(opts.port);
    if (opts.closeTime) {
      setTimeout(server.close, opts.closeTime);
    }
    return server;
  };

  const notifier = agreed.server.notifier;

  return { 
    // low level
    app, 
    // high level
    createServer,
    notifier
  };
};

