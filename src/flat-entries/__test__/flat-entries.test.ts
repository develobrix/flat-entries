import { flatEntries } from '../flat-entries';

describe('flatEntries', () => {
  const someFunction = (x: unknown) => x;
  const anotherFunction = (y: unknown) => y;

  class SomeClass {
    // noinspection JSUnusedLocalSymbols
    constructor(
      public publicProp: string,
      private privateProp: number) {
    }

    public publicFunction = someFunction;
    // noinspection JSUnusedLocalSymbols
    private privateFunction = anotherFunction;
  }

  describe('default options', () => {
    it.each([
      ['undefined', undefined],
      ['null', null],
      ['boolean primitive', true],
      ['string', 'some string'],
      ['number', 1],
      ['array', [1]],
      ['function', (a: unknown) => a],
    ])('throws an error if input is %s', (_, input) => {
      expect(() => flatEntries(input as any)).toThrow();
    });

    it('creates empty array from empty object', () => {
      expect(flatEntries({})).toEqual([]);
    });

    it.each([
      [
        'undefined',
        {
          prop: undefined,
        },
        [
          [['prop'], undefined],
        ],
      ],
      [
        'null',
        {
          prop: null,
        },
        [
          [['prop'], null],
        ],
      ],
      [
        'boolean',
        {
          prop: true,
        },
        [
          [['prop'], true],
        ],
      ],
      [
        'string',
        {
          prop: 'some string',
        },
        [
          [['prop'], 'some string'],
        ],
      ],
      [
        'number',
        {
          prop: 23,
        },
        [
          [['prop'], 23],
        ],
      ],
      [
        'array',
        {
          prop: ['some string', 23],
        },
        [
          [['prop'], ['some string', 23]],
        ],
      ],
      [
        'array of objects',
        {
          prop: [{ should: 'stay object' }],
        },
        [
          [['prop'], [{ should: 'stay object' }]],
        ],
      ],
      ['function',
        {
          prop: someFunction,
        },
        [
          [['prop'], someFunction],
        ],
      ],
    ])('creates single entry from object with single %s as value correctly', (_, input, expectedOutput) => {
      expect(flatEntries(input)).toEqual(expectedOutput);
    });

    it('creates key array for object of depth 2 correctly', () => {
      const input = {
        layer1: {
          layer2: 'some string',
        },
      };
      const expectedOutput = [
        [['layer1', 'layer2'], 'some string'],
      ];
      expect(flatEntries(input)).toEqual(expectedOutput);
    });

    it('creates entry from object with numeric keys correctly', () => {
      const input = {
        1: 2,
      };
      const expectedOutput = [
        [['1'], 2],
      ];
      expect(flatEntries(input)).toEqual(expectedOutput);
    });

    it('creates entry from object with whitespace in keys correctly', () => {
      const input = {
        'some key': 'some value',
      };
      const expectedOutput = [
        [['some key'], 'some value'],
      ];
      expect(flatEntries(input)).toEqual(expectedOutput);
    });

    it('creates entry from object with empty string as key correctly', () => {
      const input = {
        '': 'some value',
      };
      const expectedOutput = [
        [[''], 'some value'],
      ];
      expect(flatEntries(input)).toEqual(expectedOutput);
    });

    it('flattens complex object with multiple properties correctly', () => {
      const input = {
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
      const expectedOutput = [
        [['empty'], undefined],
        [['oneLayer'], 23],
        [['secondLayer', 'null'], null],
        [['secondLayer', 'boolean'], true],
        [['secondLayer', 'array'], [23]],
        [['secondLayer', 'function'], someFunction],
        [['deeply', 'deeply', 'nested', 'object'], 'value'],
      ];
      expect(flatEntries(input)).toEqual(expectedOutput);
    });

    it('flattens class instance correctly', () => {
      const input = new SomeClass('some string', 23);
      const expectedOutput = [
        [['publicProp'], 'some string'],
        [['privateProp'], 23],
        [['publicFunction'], someFunction],
        [['privateFunction'], anotherFunction],
      ];
      expect(flatEntries(input)).toEqual(expectedOutput);
    });
  });

  describe('preserveValuesForKeys option', () => {
    it.each([
      ['null', null],
      ['boolean primitive', true],
      ['string', 'some string'],
      ['number', 1],
      ['object', { prop: 'value' }],
      ['function', (a: unknown) => a],
    ])('throws an error if option is %s', (_, preserveValuesForKeys) => {
      expect(() => flatEntries({ some: 'object' }, { preserveValuesForKeys: preserveValuesForKeys as any })).toThrow();
    });

    it.each([
      ['undefined', undefined],
      ['empty array', []],
    ])('does not flatten anything if input is %s', (_, preserveValuesForKeys) => {
      const input = {
        flatten: {
          all: {
            the: 'keys',
          },
        },
      };
      const expectedOutput = [
        [['flatten', 'all', 'the'], 'keys'],
      ];
      expect(flatEntries(input, { preserveValuesForKeys: preserveValuesForKeys as any })).toEqual(expectedOutput);
    });

    it('does not flatten an object value at a given key', () => {
      const input = {
        flatten: {
          this: 'object',
        },
        keep: {
          this: 'object',
        },
      };
      const preserveValuesForKeys = ['keep'];
      const expectedOutput = [
        [['flatten', 'this'], 'object'],
        [['keep'], { this: 'object' }],
      ];
      expect(flatEntries(input, { preserveValuesForKeys })).toEqual(expectedOutput);
    });

    it('does not flatten any object values at a given key regardless of layer', () => {
      const input = {
        flatten: {
          this: 'object',
        },
        keep: {
          this: 'object',
        },
        nested: {
          flatten: {
            this: 'object',
          },
          keep: {
            this: 'object',
          },
        },
      };
      const preserveValuesForKeys = ['keep'];
      const expectedOutput = [
        [['flatten', 'this'], 'object'],
        [['keep'], { this: 'object' }],
        [['nested', 'flatten', 'this'], 'object'],
        [['nested', 'keep'], { this: 'object' }],
      ];
      expect(flatEntries(input, { preserveValuesForKeys })).toEqual(expectedOutput);
    });

    it('does not flatten object values at all given keys', () => {
      const input = {
        flatten: {
          this: 'object',
        },
        keep: {
          this: 'object',
        },
        conserve: {
          this: 'as well',
        },
      };
      const preserveValuesForKeys = ['keep', 'conserve'];
      const expectedOutput = [
        [['flatten', 'this'], 'object'],
        [['keep'], { this: 'object' }],
        [['conserve'], { this: 'as well' }],
      ];
      expect(flatEntries(input, { preserveValuesForKeys })).toEqual(expectedOutput);
    });
  });

});
