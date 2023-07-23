import { fromFlatEntries } from './from-flat-entries';

describe('fromFlatEntries', () => {
  const someFunction = (a: string) => a;

  it.each([
    ['undefined', undefined],
    ['null', null],
    ['boolean primitive', true],
    ['string', 'some string'],
    ['number', 1],
    ['object', { prop: 'value' }],
    ['function', (a: unknown) => a],
    ['array of other type than FlatEntry', [1]],
  ])('throws an error if input is %s', (_, input) => {
    expect(() => fromFlatEntries(input as any)).toThrow();
  });

  it.each([
    [
      'is empty',
      [
        [
          [],
          'never',
        ],
      ],
    ],
    [
      'contains non-string values',
      [
        [42],
        'never',
      ],
    ],
  ])('throws an error if flat entry key list %s', (_, input) => {
    expect(() => fromFlatEntries(input as any)).toThrow();
  });

  it('creates empty object from empty list', () => {
    expect(fromFlatEntries([])).toEqual({});
  });

  it.each([
    [
      'undefined',
      [
        [
          ['prop'],
          undefined,
        ],
      ],
      {
        prop: undefined,
      },
    ],
    [
      'null',
      [
        [
          ['prop'],
          null,
        ],
      ],
      {
        prop: null,
      },
    ],
    [
      'boolean',
      [
        [
          ['prop'],
          true,
        ],
      ],
      {
        prop: true,
      },
    ],
    [
      'string',
      [
        [
          ['prop'],
          'some string',
        ],
      ],
      {
        prop: 'some string',
      },
    ],
    [
      'number',
      [
        [
          ['prop'],
          23,
        ],
      ],
      {
        prop: 23,
      },
    ],
    [
      'array',
      [
        [
          ['prop'],
          ['some string', 23],
        ],
      ],
      {
        prop: ['some string', 23],
      },
    ],
    [
      'array of objects',
      [
        [
          ['prop'],
          [{ should: 'stay object' }],
        ],
      ],
      {
        prop: [{ should: 'stay object' }],
      },
    ],
    ['function',
      [
        [
          ['prop'],
          someFunction,
        ],
      ],
      {
        prop: someFunction,
      },
    ],
  ])('creates object with single %s entry correctly', (_, input, expectedOutput) => {
    expect(fromFlatEntries(input)).toEqual(expectedOutput);
  });

  it('creates object with 2 layers correctly', () => {
    const input = [
      [
        ['layer1', 'layer2'],
        'some string',
      ],
    ];
    const expectedOutput = {
      layer1: {
        layer2: 'some string',
      },
    };
    expect(fromFlatEntries(input)).toEqual(expectedOutput);
  });

  it('creates object with numeric keys correctly', () => {
    const input = [
      [
        ['1'],
        2,
      ],
    ];
    const expectedOutput = {
      1: 2,
    };
    expect(fromFlatEntries(input)).toEqual(expectedOutput);
  });

  it('creates complex object with multiple properties correctly', () => {
    const input = [
      [
        ['empty'],
        undefined,
      ],
      [
        ['oneLayer'],
        23,
      ],
      [
        ['secondLayer', 'null'],
        null,
      ],
      [
        ['secondLayer', 'boolean'],
        true,
      ],
      [
        ['secondLayer', 'array'],
        [23],
      ],
      [
        ['secondLayer', 'function'],
        someFunction,
      ],
      [
        ['deeply', 'deeply', 'nested', 'object'],
        'value',
      ],
    ];
    const expectedOutput = {
      empty: undefined,
      oneLayer: 23,
      secondLayer: {
        null: null,
        boolean: true,
        array: [23],
        function: someFunction,
      },
      deeply: {
        deeply: {
          nested: {
            object: 'value',
          },
        },
      },
    };
    expect(fromFlatEntries(input)).toEqual(expectedOutput);
  });

  it('overwrites duplicate entries with the same key and keeps the last one', () => {
    const input = [
      [
        ['only', 'simple'],
        'overwrite',
      ],
      [
        ['only', 'simple'],
        'keep',
      ],
      [
        ['object', 'to', 'simple', 'another', 'layer'],
        'overwrite another layer object',
      ],
      [
        ['object', 'to', 'simple'],
        'keep simple value',
      ],
      [
        ['simple', 'to', 'object'],
        'overwrite simple value',
      ],
      [
        ['simple', 'to', 'object', 'another', 'layer'],
        'keep another layer object',
      ],
    ];
    const expectedOutput = {
      only: {
        simple: 'keep',
      },
      object: {
        to: {
          simple: 'keep simple value',
        },
      },
      simple: {
        to: {
          object: {
            another: {
              layer: 'keep another layer object',
            },
          },
        },
      },
    };
    expect(fromFlatEntries(input)).toEqual(expectedOutput);
  });

  it('keeps empty strings as key layers', () => {
    const input = [
      [
        ['', ''],
        'value',
      ],
    ];
    const expectedOutput = {
      '': {
        '': 'value',
      },
    };
    expect(fromFlatEntries(input)).toEqual(expectedOutput);
  });
});
