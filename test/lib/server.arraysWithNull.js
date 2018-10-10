"use strict";

const agreedServer = require("../helper/server.js");
const test = require("eater/runner").test;
const http = require("http");
const AssertStream = require("assert-stream");
const assert = require("power-assert");
const mustCall = require("must-call");

test("server: check headers when case insensitive", () => {
  const server = agreedServer({
    path: "test/agrees/agrees.json5",
    port: 0
  });

  server.on("listening", () => {
    const options = {
      host: "localhost",
      method: "GET",
      path: "/test/null/agreed/values",
      port: server.address().port
    };
    const req = http
      .request(
        options,
        mustCall(res => {
          let data = "";
          res.on("data", d => (data += d));
          res.on(
            "end",
            mustCall(() => {
              const actual = JSON.parse(data);
              const expected = {
                messages: [{ message: null }, { message: "test" }]
              };
              assert.deepStrictEqual(actual, expected);
            })
          );
          server.close();
        })
      )
      .on("error", console.error);

    req.end();
  });
});
