import { FlatEntry, isObjectValue } from '../model';

/**
 * Converts a list of flat entries back to a nested object.
 * This reverses {@link flatEntries} - see there for the needed entry format.
 *
 * @example
 * // calling
 * fromFlatEntries([
 *   [['nested', 'prop'], 'value']
 * ]);
 * // returns
 * {
 *   nested: {
 *     prop: 'value',
 *   },
 * }
 *
 * @param entries `[[string[], unknown][]` list of flat entries
 * @returns object created from the flat entries
 */
export const fromFlatEntries = <E extends [string[], unknown][] | (string | unknown)[][]>(entries: E): object => {
  if (!isFlatEntryList(entries))
    throw new Error('input for fromFlatEntries from must be array of flat entries');

  return entries.reduce<object>(
    (resultObject: object, [keyLayers, value]: FlatEntry) =>
      insertRecursively(
        resultObject,
        keyLayers,
        value,
      ),
    {},
  );
};

const isFlatEntryList = (list: unknown): list is FlatEntry[] =>
  Array.isArray(list) && list.every(isFlatEntry);

const isFlatEntry = (entry: unknown): entry is FlatEntry =>
  Array.isArray(entry)
  && entry.length === 2
  && Array.isArray(entry[0])
  && entry[0].length > 0
  && entry[0].every(entry => typeof entry === 'string');

const insertRecursively = (
  obj: object,
  keyLayers: string[],
  value: unknown,
): object => {
  const key = keyLayers[0];

  return {
    ...obj,
    [key]: keyLayers.length === 1
      ? value
      : insertRecursively(
        // @ts-ignore
        key in obj && isObjectValue(obj[key]) ? obj[key] : {},
        keyLayers.slice(1),
        value,
      ),
  };
};
