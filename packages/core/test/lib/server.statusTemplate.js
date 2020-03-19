"use strict";

const agreedServer = require("../helper/server.js");
const test = require("eater/runner").test;
const http = require("http");
const AssertStream = require("assert-stream");
const assert = require("power-assert");
const mustCall = require("must-call");

test("server: check status template", () => {
  const server = agreedServer({
    agrees: [
      {
        request: {
          path: "/test/custom/agreed/status",
          query: {
            status: "{:status}"
          }
        },
        response: {
          status: "{:status}",
          body: "OK"
        }
      }
    ],
    port: 0
  });

  server.on("listening", () => {
    const options = {
      host: "localhost",
      method: "GET",
      path: "/test/custom/agreed/status?status=404",
      port: server.address().port
    };
    const req = http
      .request(options, res => {
        let data = "";
        assert.strictEqual(res.statusCode, 404);
        res.on("data", d => (data += d));
        res.on(
          "end",
          mustCall(() => {
            assert.strictEqual(data, '"OK"');
          })
        );
        server.close();
      })
      .on("error", console.error);

    req.end();
  });
});
