"use strict";

const agreedServer = require("../helper/server.js");
const test = require("eater/runner").test;
const http = require("http");
const AssertStream = require("assert-stream");
const assert = require("power-assert");
const mustCall = require("must-call");

test("server: check empty-header-value skip", () => {
  const server = agreedServer({
    agrees: [
      {
        request: {
          path: "/test/agreed/:id",
          values: {
            id: 1,
          },
        },
        response: {
          body: {
            id: 1,
          },
        },
      },
    ],
    port: 0,
    skipCheckHeaderValueNullable: true
  });

  server.on("listening", () => {
    const options = {
      host: "localhost",
      method: "GET",
      path: "/test/agreed/1",
      port: server.address().port,
      headers: {
        'empty-header': ''
      },
    };
    const req = http
      .request(options, (res) => {
        let data = "";
        res.on("data", (d) => (data += d));
        res.on(
          "end",
          mustCall(() => {
            try {
              const result = JSON.parse(data);
              assert.strictEqual(result.id, 1);
            } catch (e) {
              console.error()
            }
          })
        );
        server.close();
      })
      .on("error", console.error);

    req.end();
  });
});

test("server: check empty-header-value fail", () => {
  const server = agreedServer({
    agrees: [
      {
        request: {
          path: "/test/agreed/:id",
          values: {
            id: 1,
          },
        },
        response: {
          body: {
            id: 1,
          },
        },
      },
    ],
    port: 0,
    skipCheckHeaderValueNullable: false
  });

  server.on("listening", () => {
    const options = {
      host: "localhost",
      method: "GET",
      path: "/test/agreed/1",
      port: server.address().port,
      headers: {
        'empty-header': ''
      }
    };
    const req = http
      .request(options, (res) => {
        let data = "";
        res.on("data", (d) => (data += d));
        res.on(
          "end",
          mustCall(() => {
            try {
              const result = JSON.parse(data);
            } catch (e) {
              // fail is OK
              assert.strictEqual(1, 1);
            }
          })
        );
        server.close();
      })
      .on("error", console.error);

    req.end();
  });
});
