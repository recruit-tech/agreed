# agreed-typed

[![Greenkeeper badge](https://badges.greenkeeper.io/akito0107/agreed-typed.svg)](https://greenkeeper.io/)

- agreed api type definitions (types.ts)
- agreed.ts to swagger generator

## install
```shell
$ npm install -g agreed-typed
```

## usage
```shell
$ agreed-typed --help
Usage: agreed-typed [subcommand] [options]
Subcommands:
  gen-swagger                        Generate swagger file.
Options:
  --help                             Shows the usage and exits.
  --version                          Shows version number and exits.
Examples:
  agreed-typed gen-swagger --path ./agreed.ts
```

### gen-swagger
```shell
$ agreed-typed gen-swagger --help
Usage: agreed-typed gen-swagger [options]
  Options:
    --path                             Agreed file path (required)
    --title                            swagger title
    --description                      swagger description
    --version                          document version
    --depth                            aggregate depth (default = 2)
    --dry-run                          dry-run mode (outputs on stdout)
    --output                           output filename (default schema.json)
    --host                             swagger host (default localhost:3030)
    --format                           file format [json|yaml] (default json)
    --help                             show help
  Examples:
    agreed-typed gen-swagger --path ./agreed.ts --output schema # output file = schema.json
    agreed-typed gen-swagger --path ./agreed.ts --output schema --format yaml #  output file = schema.yaml
```

## Annotations
### Validations
http://json-schema.org/latest/json-schema-validation.html

- multipleOf
- maximum
- exclusiveMaximum
- minimum
- exclusiveMinimum
- maxLength
- minLength
- pattern
- maxItems
- minItems
- uniqueItems
- maxProperties
- minProperties
- additionalProperties
- enum
- type
- examples
- ignore
- description
- format
- default
- $ref
- id

## License
This project is licensed under the Apache License 2.0 License - see the [LICENSE](LICENSE) file for details
