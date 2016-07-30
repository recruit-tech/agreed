const test = require('eater/runner').test;
const format = require(`${process.cwd()}/lib/template/format`);
const assert = require('power-assert');

test('format: {:id} = {:aa}', () => {
  const result = format('{:id} = {:aa}', {
    id: 'fooo',
    aa: 'barrr',
  });
  assert(result === 'fooo = barrr');
});
