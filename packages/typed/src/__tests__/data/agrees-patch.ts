import {
  APIDef,
  Capture,
  Error400,
  PATCH,
  Placeholder,
  ResponseDef,
  Success204
} from "../../types";
import { CreateRequestBody } from "./agrees-post";

/**
 * @summary patch example
 */
export type PatchAPI = APIDef<
  PATCH, // HTTP Method
  ["ping", Capture<":id">], // /ping/:message
  { apiKey: string }, // header
  { q: string }, // query
  Partial<CreateRequestBody>, // Http Request Body
  {},
  | ResponseDef<Success204, undefined>
  | ResponseDef<
      Error400,
      {
        code: Placeholder<number>;
        message: string;
      }
    >
>;

const patchAPIs: PatchAPI[] = [
  {
    request: {
      path: ["ping", "121"], // /ping/test
      headers: {
        apiKey: "{:apiKey}"
      },
      method: "PATCH",
      body: {
        id: "{:id}",
        genderId: 2
      },
      values: {
        id: 123
      }
    },
    response: {
      status: 204
    }
  },
  {
    request: {
      path: ["ping", "999"], // /ping/test
      headers: {
        apiKey: "{:apiKey}"
      },
      method: "PATCH",
      body: {
        email: "hoge@hoge.com{:apiKey}",
        genderId: 2
      },
      values: {
        error: "not a number"
      }
    },
    response: {
      status: 400,
      body: {
        code: 123,
        message: "invalid parameter"
      }
    }
  }
];

module.exports = patchAPIs;
