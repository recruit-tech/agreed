export function showHelp(exitcode, help) {
  process.stdout.write(help);
  process.exit(exitcode);
}

export const flatten = (arr1: any[]) =>
  arr1.reduce((acc, val) => acc.concat(val), []);
