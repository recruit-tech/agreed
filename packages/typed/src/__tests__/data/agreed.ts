import {
  APIDef,
  Capture,
  convert,
  Error404,
  GET,
  ResponseDef,
  Success200
} from "../../types";

import * as getApis from "./agrees-get";
import * as getApi2 from "./agrees-get2";
import * as patchApis from "./agrees-patch";
import * as postApis from "./agrees-post";
import * as postApis2 from "./agrees-post2";
import * as putApis from "./agrees-put";

type HelloAPI = APIDef<
  GET, // HTTP Method
  ["user", Capture<":id">], //  /user/:id
  any, // request header
  { q: string }, // request query
  undefined, // request body
  {}, // response header
  | ResponseDef<Success200, HelloResponseBody>
  | ResponseDef<Error404, { error: "test" }> // response body and status
>;

type HelloResponseBody = { message: string };

const hellos: HelloAPI[] = [
  {
    request: {
      path: ["user", ":id"],
      method: "GET",
      query: {
        q: "{:someQueryStrings}"
      },
      body: undefined
    },
    response: {
      status: 200,
      body: {
        message: "{:id} {:someQueryString}"
      }
    }
  },
  {
    request: {
      path: ["user", "9999"],
      method: "GET",
      query: {
        q: "{:someQueryStrings}"
      },
      body: undefined
    },
    response: {
      status: 404,
      body: {
        error: "test"
      }
    }
  }
];

const agrees = [
  hellos,
  getApis,
  getApi2,
  postApis,
  putApis,
  postApis2,
  patchApis
].map((a: any) => convert(...a));

module.exports = agrees.reduce((acc, val) => acc.concat(val), []);
