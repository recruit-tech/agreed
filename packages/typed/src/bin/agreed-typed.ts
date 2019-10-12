#!/usr/bin/env node

import * as minimist from "minimist";
import { generate } from "../commands/gen-swagger";
import "../hook";
import { showHelp } from "../util";

const help = `
Usage: agreed-typed [subcommand] [options]
Subcommands:
  gen-swagger                        Generate swagger file.
Options:
  --help                             Shows the usage and exits.
  --version                          Shows version number and exits.
Examples:
  agreed-typed gen-swagger --path ./agreed.ts
`.trim();

function main() {
  const argv = minimist(process.argv.slice(2), {
    stopEarly: true,
    string: ["help", "version"]
  });
  const commands = {
    ["gen-swagger"]: generate
  };

  if (argv.help) {
    return showHelp(0, help);
  }

  if (argv.version) {
    const pack = require("../../package.json");
    process.stdout.write(pack.version);
    return;
  }
  const subcommand = argv._.shift();

  const fun = commands[subcommand];

  if (!fun) {
    return showHelp(1, help);
  }

  fun(argv._);
}

main();
