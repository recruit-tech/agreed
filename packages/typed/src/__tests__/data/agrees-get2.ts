import {
  APIDef,
  Capture,
  GET,
  Integer,
  Placeholder,
  ResponseDef,
  Success200,
  Success201
} from "../../types";

export type UserAPI = APIDef<
  GET,
  ["user", Capture<":id", Integer>],
  {},
  { q: string; q2?: Integer },
  undefined,
  { "x-csrf-token": "csrf-token" },
  | ResponseDef<
      Success200,
      {
        message: string;
        images: Placeholder<string[]>;
        themes: Placeholder<theme>;
      }
    >
  | ResponseDef<Success201, resp>
>;

type theme = {
  name: string;
};

type resp = {
  param?: Placeholder<{
    name: string;
  }>;
  param2: Placeholder<{
    nested: Placeholder<number>;
  }>;
};

const api: UserAPI[] = [
  {
    request: {
      path: ["user", 123],
      method: "GET",
      query: {
        q: "{:someQueryStrings}"
      },
      body: undefined,
      values: {
        id: "yosuke",
        someQueryStrings: "foo"
      }
    },
    response: {
      status: 200,
      headers: {
        "x-csrf-token": "csrf-token"
      },
      body: {
        message: "{:greeting} {:id} {:someQueryStrings}",
        images: "{:images}",
        themes: "{:themes}"
      },
      values: {
        greeting: "hello",
        images: ["http://example.com/foo.jpg", "http://example.com/bar.jpg"],
        themes: {
          name: "green"
        }
      }
    }
  },
  {
    request: {
      path: ["user", ":id"],
      method: "GET",
      query: {
        q: "{:someQueryStrings}"
      },
      body: undefined,
      values: {
        id: "yosuke",
        someQueryStrings: "foo"
      }
    },
    response: {
      status: 201,
      headers: {
        "x-csrf-token": "csrf-token"
      },
      body: {
        param: "{:aaa}",
        param2: {
          nested: 123
        }
      },
      values: {
        aaa: "test"
      }
    }
  }
];

module.exports = api;
