import { ReducedSpec } from "./commands/gen-swagger";

export function generateSwagger(
  specs: ReducedSpec[],
  title = "Agreed",
  description = "Generate via agreed-typed",
  version = "0.0.1",
  host = "localhost:3000",
  definitions,
  disablePathNumber
) {
  const swagger = {
    swagger: "2.0",
    info: {
      title,
      description,
      version
    },
    host,
    produces: ["application/json"],
    consumes: ["application/json"],
    paths: generatePath(specs, definitions, disablePathNumber),
    definitions
  };

  return swagger;
}

function generatePath(
  specs: ReducedSpec[],
  definitions: any,
  disablePathNumber: boolean
) {
  const genpath = (schema: ReducedSpec) => {
    const pathParam = schema.path.reduce(
      (p, c, i) => {
        if (c.startsWith(":")) {
          const placeholder = c.slice(1);
          p.name += `/{${placeholder}}`;
          p.params.push({ param: placeholder, idx: i });
          return p;
        }
        p.name += "/" + c;
        return p;
      },
      { name: "", params: [] }
    );

    const schemas = schema.schemas.reduce((p, c: any) => {
      const {
        query,
        method,
        headers,
        body,
        path
      } = c.schema.properties.request.properties;
      if (p[method.enum[0]]) {
        throw new Error("generator duplicated specs");
      }
      let parameters = [
        ...parsePathParam(pathParam.params, path, disablePathNumber),
        ...parseProperties(query, "query", definitions),
        ...parseProperties(headers, "header", definitions)
      ];

      if (body && (body.properties || body.$ref)) {
        parameters = parameters.concat(parseBody(body));
      }
      const responses = parseResponse(c.schema.properties.response);

      const doc: any = !c.doc
        ? {}
        : {
            description: c.doc.ast.description,
            ...c.doc.ast.tags.reduce((a, t) => {
              a[t.title] = t.description;
              return a;
            }, {})
          };

      p[method.enum[0].toLowerCase()] = { parameters, responses, ...doc };

      return p;
    }, {});

    return { [pathParam.name]: schemas };
  };

  return specs.reduce((p, c) => {
    return {
      ...p,
      ...genpath(c)
    };
  }, {});
}

function parseBody(body: object): object {
  return {
    in: "body",
    name: "request body",
    required: true,
    schema: body
  };
}

function parseResponse(resp: any): object {
  const responses = resp.anyOf ? resp.anyOf.map(a => a.allOf) : [resp.allOf];
  return responses.reduce((p, c) => {
    const headers = c.find(r => r.properties.headers);
    const statusCode = c.find(r => r.properties.status);
    const body = c.find(r => r.properties.body);

    const headerProps = headers ? headers.properties.headers.properties : {};
    const h = Object.keys(headerProps).reduce((m, current) => {
      return {
        ...m,
        [current]: {
          description: current,
          type: headerProps[current].type
        }
      };
    }, {});
    const description =
      statusCode.properties.status.enum[0] > 399 ? "Failure" : "Success";
    if (body.properties.body.type === "undefined") {
      return {
        ...p,
        [`${statusCode.properties.status.enum[0]}`]: {
          description,
          headers: h
        }
      };
    }
    return {
      ...p,
      [`${statusCode.properties.status.enum[0]}`]: {
        description,
        headers: h, // headers ? parseProperties(headers, "header") : {},
        schema: body.properties.body
      }
    };
  }, {});
}

function parsePathParam(
  paths: Array<{ param: string; idx: number }>,
  path: any,
  disablePathNumber: boolean
): object[] {
  return paths.map(p => {
    const param = path.items[p.idx];
    // workaround
    if (disablePathNumber && param.type === "number") {
      param.type = "integer";
    }
    return {
      in: "path",
      name: p.param,
      required: true,
      ...param
    };
  });
}

function parseProperties(query, inname, definitions): object[] {
  const { properties } = query;
  return Object.keys(properties).map(k => {
    if (properties[k].$ref) {
      const defName = `${properties[k].$ref}`.split("/").slice(-1)[0];
      const def = definitions[defName];
      return {
        in: inname,
        name: k,
        ...def
      };
    }
    if (properties[k].enum) {
      return {
        in: inname,
        required: query.required ? query.required.includes(k) : false,
        type: properties[k].type,
        name: k,
        enum: properties[k].enum,
        default: properties[k].enum[0]
      };
    }
    return {
      in: inname,
      required: query.required ? query.required.includes(k) : false,
      type: properties[k].type,
      name: k,
      format: properties[k].format,
      ...properties[k]
    };
  });
}
