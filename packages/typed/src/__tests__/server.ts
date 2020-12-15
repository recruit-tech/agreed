import * as Agreed from "@agreed/core";
import axios from "axios";
import * as bodyParser from "body-parser";
import * as cors from "cors";
import * as express from "express";
import * as getPort from "get-port";
import * as path from "path";
import * as assert from "assert";

const setupServer = (agreed) => {
  const app = express();
  app.use(bodyParser.json());
  app.use(cors());
  app.use(
    agreed.middleware({
      path: path.resolve(__dirname, "./data/agreed.ts"),
    })
  );
  app.use((err, _, res) => {
    // tslint:disable-next-line
    res.statusCode = 500;
    res.send(`Error is occurred : ${err}`);
  });

  return app;
};

test("register ts agrees with get", async (done) => {
  const port = await getPort();
  const agreed = new Agreed();

  const app = setupServer(agreed);

  const serv = app.listen(port, async () => {
    try {
      const response = await axios.get(`http://localhost:${port}/ping/hello`);
      assert.strictEqual(response.status, 200);
      assert.deepStrictEqual(response.data, { message: "ok hello" });

      serv.close(done);
    } catch (e) {
      serv.close();
      done(e);
    }
  });
});

test("register ts agrees with get and query", async (done) => {
  const port = await getPort();
  const agreed = new Agreed();

  const app = setupServer(agreed);

  const serv = app.listen(port, async () => {
    try {
      const response = await axios.get(
        `http://localhost:${port}/ping/test?moo=moo&q=q&query2=1`
      );
      // Agree Not Found when it comes to exact matching of path values
      assert.deepStrictEqual(response.data, { message: "ok test" });

      serv.close(done);
    } catch (e) {
      serv.close();
      done(e);
    }
  });
});

test("register ts agrees with post", async (done) => {
  const port = await getPort();
  const agreed = new Agreed();

  const app = setupServer(agreed);

  const serv = app.listen(port, async () => {
    try {
      const response = await axios.post(
        `http://localhost:${port}/ping/test`,
        {
          email: "hoge@hoge.comaaa",
          id: 123,
          genderId: 2,
        },
        {
          headers: {
            apiKey: "aaa",
          },
        }
      );
      assert.strictEqual(response.status, 201);
      assert.deepStrictEqual(response.data, { message: "test" });

      serv.close(done);
    } catch (e) {
      serv.close();
      done(e);
    }
  });
});
