'use strict';

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

test('format: {:id.foo} = {:aa.bar}', () => {
  const result = format('{:id.foo} = {:aa.bar}', {
    id: {
      foo: 'fooo'
    },
    aa: {
      bar: 'barrr'
    },
  });
  assert(result === 'fooo = barrr');
});

test('format: {:id.foo.bar} = {:aa.bar.baz}', () => {
  const result = format('{:id.foo.bar} = {:aa.bar.baz}', {
    id: {
      foo: {
        bar: 'fooo'
      }
    },
    aa: {
      bar: {
        baz: 'barrr'
      }
    },
  });
  assert(result === 'fooo = barrr');
});

test('format: object format', () => {
  const obj = {
    a: '{:abc}',
    b: '{:def}',
    c: '{:ghi}',
  };
  const result = format(obj, {
    abc: true,
    def: [
      1, 2, 3, null
    ],
    ghi: {
      'aaaa': 'bbb'
    },
  });
  assert.deepStrictEqual(result, {a: true, b: [1,2,3, null], c: { aaaa: 'bbb' }});
});

test('format: nested json and format is unmatched', () => {
  const obj = {
    a: {
      abc: '{:abc}'
    },
    b: '{:def}',
    c: '{:ghi}',
  };
  const result = format(obj, {
    id: 'fooo',
    aa: 'barrr',
    ghi: '123'
  });
  assert.deepStrictEqual(result, {
    a: {
      abc: '{:abc}'
    },
    b: '{:def}',
    c: '123',
  });
});

test('format: array format', () => {
  const obj = {
    a: {
      abc: '{:abc}'
    },
    b: [
      1, 2, 3
    ],
    c: '{:ghi}',
  };
  const result = format(obj, {
    id: 'fooo',
    aa: 'barrr',
    ghi: '123'
  });
  
  assert.deepStrictEqual(result, {
    a: {
      abc: '{:abc}'
    },
    b: [
      1, 2, 3
    ],
    c: '123',
  });
});

test('format: number format', () => {
  const obj = {
    a: {
      abc: 1
    },
    c: '{:ghi}',
  };
  const result = format(obj, {
    id: 'fooo',
    aa: 'barrr',
    ghi: '123'
  });
  assert.deepStrictEqual(result, {
    a: {
      abc: 1
    },
    c: '123',
  });
});

test('format: brackets notation :ghi[:id]', () => {
  const obj = {
    a: {
      abc: 1
    },
    c: '{:ghi[:id]}',
  };
  const result = format(obj, {
    id: 'fooo',
    aa: 'barrr',
    ghi: {
      fooo: '123',
      baaa: '234'
    }
  });
  assert.deepStrictEqual(result, {
    a: {
      abc: 1
    },
    c: '123',
  });
});

test('format: brackets notation :ghi[:id][:aa]', () => {
  const obj = {
    a: {
      abc: 1
    },
    c: '{:ghi[:id][:aa]}',
  };
  const result = format(obj, {
    id: 'fooo',
    aa: 'barrr',
    ghi: {
      fooo: {
        barrr: '123'
      },
      baaa: '234'
    }
  });
  assert.deepStrictEqual(result, {
    a: {
      abc: 1
    },
    c: '123',
  });
});

test('format: brackets notation to use array', () => {
  const obj = {
    a: {
      abc: 1
    },
    c: '{:ghi[:id]}',
  };
  const result = format(obj, {
    id: 1,
    aa: 'barrr',
    ghi: [
      1, 2, 3
    ]
  });
  assert.deepStrictEqual(result, {
    a: {
      abc: 1
    },
    c: 2,
  });
});

test('format: array 1-last notation to spread array', () => {
  const obj = {
    arr: [
      {
        name: '{:ghi.0.name}'
      },
      '{:ghi.1-last}',
    ]
  };
  const result = format(obj, {
    ghi: [
      {
        name: 'foo',
      },
      {
        name: 'bar',
      },
      {
        name: 'baz',
      },
    ]
  });

  assert.deepStrictEqual(result, {
    arr: [
      {
        name: 'foo',
      },
      {
        name: 'bar',
      },
      {
        name: 'baz',
      },
    ]
  });
});

test('format: array 1-4 notation to spread array', () => {
  const obj = {
    arr: [
      {
        name: '{:ghi.0.name}'
      },
      '{:ghi.1-4}',
    ]
  };
  const result = format(obj, {
    ghi: [
      {
        name: 'foo',
      },
      {
        name: 'bar',
      },
      {
        name: 'baz',
      },
      {
        name: 'bar',
      },
      {
        name: 'baz',
      },
    ]
  });

  assert.deepStrictEqual(result, {
    arr: [
      {
        name: 'foo',
      },
      {
        name: 'bar',
      },
      {
        name: 'baz',
      },
      {
        name: 'bar',
      },
    ]
  });
});

test('format: array 1-last notation to spread array with null', () => {
  const obj = {
    arr: [
      {
        name: '{:ghi.0.name}'
      },
      '{:ghi.1-last}',
    ]
  };
  const result = format(obj, {
    ghi: [
      {
        name: null,
      },
      {
        name: 'bar',
      },
      {
        name: 'baz',
      },
      {
        name: 'bar',
      },
      {
        name: null,
      },
    ]
  });

  assert.deepStrictEqual(result, {
    arr: [
      {
        name: null,
      },
      {
        name: 'bar',
      },
      {
        name: 'baz',
      },
      {
        name: 'bar',
      },
      {
        name: null,
      },
    ]
  });
});

