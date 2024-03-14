import Agreed from "@agreed/core";
import bodyParser from "body-parser";
import express from "express";
import path from "node:path";
import assert from "node:assert";
import test from "node:test";

const setupServer = (agreed, opts = {}) => {
  const app = express();
  app.use(bodyParser.json());
  app.use(
    agreed.middleware({
      ...opts,
      path: path.resolve(__dirname, "./data/agreed.ts"),
    })
  );
  app.use((err, _, res, _next) => {
    res.status(500);
    res.send(`Error is occurred : ${err}`);
  });

  return app;
};

test("register ts agrees with get", (t, done) => {
  const app = setupServer(new Agreed());
  const server = app.listen(0, async () => {
    try {
      const address = server?.address();
      if (!address || typeof address === "string") {
        throw new Error("address is invalid");
      }
      const port = address.port;
      const response = await fetch(`http://localhost:${port}/ping/hello`);
      assert.strictEqual(response.status, 200);
      const data = await response.json();
      assert.deepStrictEqual(data, { message: "ok hello" });
      server.close(done);
    } catch (e) {
      server.close();
      done(e);
    }
  });
});

test("register ts agrees with get and query", (t, done) => {
  const app = setupServer(new Agreed());
  const server = app.listen(0, async () => {
    try {
      const address = server?.address();
      if (!address || typeof address === "string") {
        throw new Error("address is invalid");
      }
      const port = address.port;
      const response = await fetch(
        `http://localhost:${port}/ping/test?moo=moo&q=q&query2=1`
      );
      assert.strictEqual(response.status, 200);
      const data = await response.json();
      assert.deepStrictEqual(data, { message: "test" });
      server.close(done);
    } catch (e) {
      server.close();
      done(e);
    }
  });
});

test("register ts agrees with post", (t, done) => {
  const app = setupServer(new Agreed());
  const server = app.listen(0, async () => {
    try {
      const address = server?.address();
      if (!address || typeof address === "string") {
        throw new Error("address is invalid");
      }
      const port = address.port;
      const response = await fetch(`http://localhost:${port}/ping/test`, {
        method: "POST",
        body: JSON.stringify({
          email: "hoge@hoge.comaaa",
          id: 123,
          genderId: 2,
        }),
        headers: {
          "Content-Type": "application/json",
          apiKey: "aaa",
        },
      });
      assert.strictEqual(response.status, 201);
      const data = await response.json();
      assert.deepStrictEqual(data, { message: "test" });
      server.close(done);
    } catch (e) {
      server.close();
      done(e);
    }
  });
});

test("register ts agrees with post", (t, done) => {
  const app = setupServer(new Agreed());
  const server = app.listen(0, async () => {
    try {
      const address = server?.address();
      if (!address || typeof address === "string") {
        throw new Error("address is invalid");
      }
      const port = address.port;
      const response = await fetch(`http://localhost:${port}/ping/test`, {
        method: "POST",
        body: JSON.stringify({
          email: "hoge@hoge.comaaa",
          id: 123,
          genderId: 2,
        }),
        headers: {
          "Content-Type": "application/json",
          apiKey: "aaa",
        },
      });
      assert.strictEqual(response.status, 201);
      const data = await response.json();
      assert.deepStrictEqual(data, { message: "test" });
      server.close(done);
    } catch (e) {
      server.close();
      done(e);
    }
  });
});

test("register ts agrees with get and query (when enable-prefer-query option is true)", (t, done) => {
  const app = setupServer(new Agreed(), { enablePreferQuery: true });
  const server = app.listen(0, async () => {
    try {
      const address = server?.address();
      if (!address || typeof address === "string") {
        throw new Error("address is invalid");
      }
      const port = address.port;
      const response = await fetch(
        `http://localhost:${port}/ping/test?moo=moo&q=q&query2=1`
      );
      // Agree Not Found when it comes to exact matching of path values
      const data = await response.json();
      assert.deepStrictEqual(data, { message: "ok test" });
      server.close(done);
    } catch (e) {
      server.close();
      done(e);
    }
  });
});