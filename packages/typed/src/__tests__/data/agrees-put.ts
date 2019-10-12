import {
  APIDef,
  Capture,
  Error400,
  Placeholder,
  PUT,
  ResponseDef,
  Success204
} from "../../types";

/**
 * @summary put example
 */
export type UpdateAPI = APIDef<
  PUT, // HTTP Method
  ["ping", Capture<":id">], // /ping/:message
  { apiKey: string }, // header
  { q: string }, // query
  CreateRequestBody, // Http Request Body
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
  id: Placeholder<number>;
  genderId: GenderType;
};

const createAPIs: UpdateAPI[] = [
  {
    request: {
      path: ["ping", "121"], // /ping/test
      headers: {
        apiKey: "{:apiKey}"
      },
      method: "PUT",
      body: {
        email: "hoge@hoge.com{:apiKey}",
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
      method: "PUT",
      body: {
        email: "hoge@hoge.com{:apiKey}",
        id: "{:error}",
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

module.exports = createAPIs;
