export type GET = "GET";
export type HEAD = "HEAD";
export type POST = "POST";
export type PUT = "PUT";
export type PATCH = "PATCH";
export type DELETE = "DELETE";

export type HTTPMethods = GET | HEAD | POST | PATCH | PUT | DELETE;

export type Capture<T extends string, P = string> = P extends string
  ? (T | string)
  : (P | string);

export type Placeholder<T> = T | string;

export type Path = Array<string | Capture<string, any>>;

export type RequestBody<Method extends HTTPMethods> = Method extends
  | POST
  | PATCH
  | PUT
  ? object
  : undefined;

export type Headers = object;

export type Query = object;

export type RequestDef<
  P extends Path,
  H extends Headers,
  Q extends Query,
  M extends HTTPMethods,
  B extends RequestBody<M>
> = {
  path: P;
  method: M;
  headers?: H;
  query?: Q;
  values?: object;
  body: B;
};

export type Status<C extends number, T extends string> = {
  status: C;
  statusText?: T;
};

export type Success200 = Status<200, "OK">;
export type Success201 = Status<201, "Created">;
export type Success202 = Status<202, "Accepted">;
export type Success203 = Status<203, "Non-Authoritative Information">;
export type Success204 = Status<204, "No Content">;
export type Success205 = Status<205, "Reset Content">;
export type Success206 = Status<206, "Parial Content">;
export type Success207 = Status<207, "Multi-Status">;
export type Success208 = Status<208, "Already Reported">;
export type Success226 = Status<226, "IM Used">;

export type Redirection300 = Status<300, "Multiple Choices">;
export type Redirection301 = Status<301, "Moved Permanently">;
export type Redirection302 = Status<302, "Found">;
export type Redirection303 = Status<303, "See Other">;
export type Redirection304 = Status<304, "Not Modified">;
export type Redirection305 = Status<305, "Use Proxy">;
export type Redirection307 = Status<307, "Temporary Redirect">;
export type Redirection308 = Status<308, "Permanent Redirect">;

// 40x client error
export type Error400 = Status<400, "Bad Request">;
export type Error401 = Status<401, "Unauthorized">;
export type Error402 = Status<402, "Payment Required">;
export type Error403 = Status<403, "Forbidden">;
export type Error404 = Status<404, "Not Found">;
export type Error405 = Status<405, "Method Not Allowed">;
export type Error406 = Status<406, "Not Acceptable">;
export type Error407 = Status<407, "Proxy Authentication Required">;
export type Error408 = Status<408, "Request Timeout">;
export type Error409 = Status<409, "Conflict">;
export type Error410 = Status<410, "Gone">;
export type Error411 = Status<411, "Length Required">;
export type Error412 = Status<412, "Precondition Failed">;
export type Error413 = Status<413, "Payload Too Large">;
export type Error414 = Status<414, "URI Too Long">;
export type Error415 = Status<415, "Unsupported Media Type">;
export type Error416 = Status<416, "Range Not Satisfiable">;
export type Error417 = Status<417, "Expectation Failed">;
export type Error418 = Status<418, "I'm teapot">;
export type Error421 = Status<421, "Misdirected Request">;
export type Error422 = Status<422, "Unprocessable Entity">;
export type Error423 = Status<423, "Locked">;
export type Error424 = Status<424, "Failed Dependency">;
export type Error425 = Status<425, "Too Early">;
export type Error426 = Status<426, "Upgrade Required">;
export type Error451 = Status<451, "Unavailable For Legal Reasons">;

// 50x server error
export type Error500 = Status<500, "Internal Server Error">;
export type Error501 = Status<501, "Not Implemented">;
export type Error502 = Status<502, "Bad Gateway">;
export type Error503 = Status<503, "Service Unavailable">;
export type Error504 = Status<504, "Gateway Timeout">;
export type Error505 = Status<505, "HTTP version Not Supported">;
export type Error506 = Status<506, "Variant Also Negotiates">;
export type Error507 = Status<507, "Insufficient Storage">;
export type Error508 = Status<508, "Loop Detected">;
export type Error509 = Status<509, "Bandwidth Limit Exceeded">;
export type Error510 = Status<510, "Not Extended">;
export type Error511 = Status<511, "Network Authentication Required">;

export type ResponseBody = object;

export type ResponseDef<
  S extends Status<number, string>,
  B extends ResponseBody
> = {
  body?: S extends Success204 ? undefined : B;
} & S;

export type APIDef<
  M extends HTTPMethods,
  P extends Path,
  ReqHeader extends Headers,
  Q extends Query,
  ReqBody extends RequestBody<M>,
  RespHeader extends Headers,
  Resp extends ResponseDef<Status<number, string>, object>
> = {
  title?: string;
  description?: string;
  request: RequestDef<P, ReqHeader, Q, M, ReqBody>;
  response: {
    headers?: RespHeader;
    values?: object;
  } & Resp;
};

export function convert(...apis: Array<{ request }>) {
  return apis.map(a => {
    const { path } = a.request;
    if (typeof path === "string") {
      return a;
    }
    a.request.path = "/" + path.join("/");
    return a;
  });
}

/**
 * @TJS-type integer
 */
export type Integer = number;

/**
 * @TJS-type integer
 * @minimum 0
 * @maximum 4294967295
 */
export type UInt32 = number;

/**
 * @TJS-type integer
 * @minimum 0
 * @maximum 18446744073709551615
 */
export type UInt64 = number;

/**
 * internal API, only for go-swagger
 * @param obj
 */
export function replace(obj) {
  if (typeof obj !== "object") {
    return obj;
  }
  if (obj == null) {
    return true;
  }
  if (obj.properties) {
    const required = obj.required || [];
    const properties = obj.properties || {};

    obj.properties = Object.keys(properties).reduce(
      (p, prop) => {
        const currentProp = required.includes(prop)
          ? {
              ...p[prop]
            }
          : {
              ...p[prop],
              "x-nullable": true
            };

        return {
          ...p,
          [prop]: currentProp
        };
      },
      { ...properties }
    );
  }

  return Array.isArray(obj)
    ? obj.map(replace)
    : Object.keys(obj).reduce((p, c) => {
        p[c] = replace(obj[c]);
        return p;
      }, {});
}
