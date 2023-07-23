import { fromFlatEntries } from '../from-flat-entries/from-flat-entries';
import { flatEntries } from '../flat-entries/flat-entries';

describe('invertibility', () => {
  const someFunction = (a: unknown) => a;

  it.each([
    {},
    { key: undefined },
    { key: null },
    { some: 'value' },
    {
      some: {
        nested: 'value',
      },
    },
    { array: [1, 2] },
    { func: someFunction },
  ])('fromFlatEntries on the result of flatEntries restores original object', (input) => {
    expect(fromFlatEntries(flatEntries(input))).toEqual(input);
  });
});
