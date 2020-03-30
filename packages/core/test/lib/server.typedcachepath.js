// eater:only
"use strict";

const agreedServer = require("../helper/server.js");
const http = require("http");
const test = require("eater/runner").test;
const AssertStream = require("assert-stream");
const plzPort = require("plz-port");
const assert = require("power-assert");
const mustCall = require("must-call");
const os = require("os");
const fs = require("fs");

test("server: POST API with ts agrees using typed cache path", () => {
  plzPort().then(port => {
    const dest = `${os.tmpdir()}/agrees.ts`;
    const cachePath = `${os.tmpdir()}/.agreed.json`;
    fs.copyFileSync("test/agrees/agrees.ts", dest);
    const server = agreedServer({
      path: dest,
      port: port,
      typedCachePath: cachePath,
    });

    server.on("listening", () => {
      const postData = JSON.stringify({
        message: "test"
      });
      const options = {
        host: "localhost",
        method: "POST",
        path: "/ts-messages",
        port: port,
        headers: {
          "Content-Type": "application/json",
          "Content-Length": Buffer.byteLength(postData)
        }
      };
      const req = http
        .request(options, res => {
          const assert = new AssertStream();
          assert.expect({ result: "test" });
          res.pipe(assert);
          server.close();
        })
        .on("error", console.error);

      req.write(postData);
      req.end();
    });
  });
});

test("server: POST API with ts agrees using typed cache path using cache", () => {
  plzPort().then(port => {
    const dest = `${os.tmpdir()}/agrees.ts`;
    const cachePath = `${os.tmpdir()}/.agreed.json`;
    const server = agreedServer({
      path: dest,
      port: port,
      typedCachePath: cachePath,
    });

    server.on("listening", () => {
      const postData = JSON.stringify({
        message: "test"
      });
      const options = {
        host: "localhost",
        method: "POST",
        path: "/ts-messages",
        port: port,
        headers: {
          "Content-Type": "application/json",
          "Content-Length": Buffer.byteLength(postData)
        }
      };
      const req = http
        .request(options, res => {
          const assert = new AssertStream();
          assert.expect({ result: "test" });
          res.pipe(assert);
          server.close();
        })
        .on("error", console.error);

      req.write(postData);
      req.end();
    });
  });
});

test("server: POST API with ts agrees using typed cache path using cache", () => {
  plzPort().then(port => {
    const dest = `${os.tmpdir()}/agrees.ts`;
    const cachePath = `${os.tmpdir()}/.agreed.json`;
    const content = `
module.exports = [{
  request: {
    path: '/ts-messages2',
    method: 'POST',
    body: {
      message: '{:message}'
    },
    values: {
      message: 'test'
    }
  }, 
  response: {
    body: {
      result: '{:message}'
    },
    values: {
      message: 'test'
    },
  },
}];
    `;
    fs.writeFileSync(dest, content);
    const server = agreedServer({
      path: dest,
      port: port,
      typedCachePath: cachePath,
    });

    server.on("listening", () => {
      const postData = JSON.stringify({
        message: "test"
      });
      const options = {
        host: "localhost",
        method: "POST",
        path: "/ts-messages2",
        port: port,
        headers: {
          "Content-Type": "application/json",
          "Content-Length": Buffer.byteLength(postData)
        }
      };
      const req = http
        .request(options, res => {
          const assert = new AssertStream();
          assert.expect({ result: "test" });
          res.pipe(assert);
          server.close();
        })
        .on("error", console.error);

      req.write(postData);
      req.end();
    });
  });
});

test("server: use agreed-typed fixtures", () => {
  plzPort().then(port => {
    const cachePath = `${os.tmpdir()}/.agreed.json`;
    const server = agreedServer({
      path: "../typed/src/__tests__/data/agreed.ts",
      port: port,
      typedCachePath: cachePath,
    });

    server.on("listening", () => {
      const options = {
        host: "localhost",
        method: "GET",
        path: "/ping/test",
        port: port,
        headers: {
          "Content-Type": "application/json",
        }
      };
      const req = http
        .request(options, res => {
          const assert = new AssertStream();
          assert.expect({ message: "ok test" });
          res.pipe(assert);
          server.close();
        })
        .on("error", console.error);
      req.end();
    });
  });
});
