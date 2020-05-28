"use strict";

const agreedServer = require("../helper/server.js");
const test = require("eater/runner").test;
const http = require("http");
const AssertStream = require("assert-stream");
const assert = require("power-assert");
const mustCall = require("must-call");

test("server: check path params priority - 1", () => {
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
      {
        request: {
          path: "/test/agreed/:id",
          values: {
            id: 2,
          },
        },
        response: {
          body: {
            id: 2,
          },
        },
      },
      {
        request: {
          path: "/test/agreed/:id",
          values: {
            id: 3,
          },
        },
        response: {
          body: {
            id: 3,
          },
        },
      },
    ],
    port: 0,
  });

  server.on("listening", () => {
    const options = {
      host: "localhost",
      method: "GET",
      path: "/test/agreed/1",
      port: server.address().port,
    };
    const req = http
      .request(options, (res) => {
        let data = "";
        res.on("data", (d) => (data += d));
        res.on(
          "end",
          mustCall(() => {
            const result = JSON.parse(data);
            assert.strictEqual(result.id, 1);
          })
        );
        server.close();
      })
      .on("error", console.error);

    req.end();
  });
});

test("server: check path params priority - 2", () => {
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
      {
        request: {
          path: "/test/agreed/:id",
          values: {
            id: 2,
          },
        },
        response: {
          body: {
            id: 2,
          },
        },
      },
      {
        request: {
          path: "/test/agreed/:id",
          values: {
            id: 3,
          },
        },
        response: {
          body: {
            id: 3,
          },
        },
      },
    ],
    port: 0,
  });

  server.on("listening", () => {
    const options = {
      host: "localhost",
      method: "GET",
      path: "/test/agreed/2",
      port: server.address().port,
    };
    const req = http
      .request(options, (res) => {
        let data = "";
        res.on("data", (d) => (data += d));
        res.on(
          "end",
          mustCall(() => {
            const result = JSON.parse(data);
            assert.strictEqual(result.id, 2);
          })
        );
        server.close();
      })
      .on("error", console.error);

    req.end();
  });
});

test("server: check path params priority - 3", () => {
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
      {
        request: {
          path: "/test/agreed/:id",
          values: {
            id: 2,
          },
        },
        response: {
          body: {
            id: 2,
          },
        },
      },
      {
        request: {
          path: "/test/agreed/:id",
          values: {
            id: 3,
          },
        },
        response: {
          body: {
            id: 3,
          },
        },
      },
    ],
    port: 0,
  });

  server.on("listening", () => {
    const options = {
      host: "localhost",
      method: "GET",
      path: "/test/agreed/3",
      port: server.address().port,
    };
    const req = http
      .request(options, (res) => {
        let data = "";
        res.on("data", (d) => (data += d));
        res.on(
          "end",
          mustCall(() => {
            const result = JSON.parse(data);
            assert.strictEqual(result.id, 3);
          })
        );
        server.close();
      })
      .on("error", console.error);

    req.end();
  });
});

test("server: check path params priority - 4", () => {
  const server = agreedServer({
    agrees: [
      {
        request: {
          path: "/test/agreed/:foo/:bar",
          values: {
            foo: 1,
            bar: 2,
          },
        },
        response: {
          body: {
            id: 1,
          },
        },
      },
      {
        request: {
          path: "/test/agreed/1/3",
        },
        response: {
          body: {
            id: 2,
          },
        },
      },
    ],
    port: 0,
  });

  server.on("listening", () => {
    const options = {
      host: "localhost",
      method: "GET",
      path: "/test/agreed/1/2",
      port: server.address().port,
    };
    const req = http
      .request(options, (res) => {
        let data = "";
        res.on("data", (d) => (data += d));
        res.on(
          "end",
          mustCall(() => {
            const result = JSON.parse(data);
            assert.strictEqual(result.id, 1);
          })
        );
        server.close();
      })
      .on("error", console.error);

    req.end();
  });
});

test("server: check path params priority - 5", () => {
  const server = agreedServer({
    agrees: [
      {
        request: {
          path: "/test/agreed/:foo/:bar",
          values: {
            foo: 1,
            bar: 2,
          },
        },
        response: {
          body: {
            id: 1,
          },
        },
      },
      {
        request: {
          path: "/test/agreed/1/3",
        },
        response: {
          body: {
            id: 2,
          },
        },
      },
    ],
    port: 0,
  });

  server.on("listening", () => {
    const options = {
      host: "localhost",
      method: "GET",
      path: "/test/agreed/1/3",
      port: server.address().port,
    };
    const req = http
      .request(options, (res) => {
        let data = "";
        res.on("data", (d) => (data += d));
        res.on(
          "end",
          mustCall(() => {
            const result = JSON.parse(data);
            assert.strictEqual(result.id, 2);
          })
        );
        server.close();
      })
      .on("error", console.error);

    req.end();
  });
});
