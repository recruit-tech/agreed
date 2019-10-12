import {
  APIDef,
  Capture,
  Placeholder,
  POST,
  ResponseDef,
  Success201
} from "../../types";
import { SubBody } from "./types";

export type CreateAPI2 = APIDef<
  POST, // HTTP Method
  ["ping", Capture<":message">, "2"], // /ping/:message
  { apiKey: string }, // header
  { q: string }, // query
  CreateRequestBody, // Http Request Body
  {},
  ResponseDef<Success201, CreateResponseBody2>
>;

enum GenderType {
  Male = 1,
  Famale,
  Other
}

type CreateRequestBody = {
  /**
   * @pattern [A-Z]+
   */
  email: string;
  /**
   * @maximum 1000
   * @minimum 0
   */
  id: number;
  genderId: GenderType;
};

type CreateResponseBody2 = {
  // prettier-ignore
  messages: Array<Placeholder<SubBody>>;
};

const createAPIs: CreateAPI2[] = [
  {
    request: {
      path: ["ping", "test", "2"], // /ping/test
      headers: {
        apiKey: "{:apiKey}"
      },
      method: "POST",
      body: {
        email: "hoge@hoge.com{:apiKey}",
        id: 123,
        genderId: 2
      },
      values: {
        id: 123
      }
    },
    response: {
      status: 201,
      body: {
        messages: ["{:value}"]
      }
    }
  }
];

module.exports = createAPIs;
