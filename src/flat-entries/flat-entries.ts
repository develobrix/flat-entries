import { FlatEntry, isObjectValue } from '../model';

/**
 * Options for {@link flatEntries}
 *
 * - `preserveValuesForKeys`: list of keys, at which object values shall be preserved, i.e. not be further flattened (regardless of layer in the object)
 */
export type FlatEntriesOptions = {
  preserveValuesForKeys: string[]
}

/**
 * Converts an object to a flat list of all its non-object entries.
 * In contrast to `Object.entries`, this function flattens the object across all its layers.
 * Each returned entry contains a list of keys (= the layers in the object) and the flat value.
 *
 * @example
 * // calling
 * flatEntries({
 *   nested: {
 *     prop: 'value',
 *   },
 * });
 * // returns
 * [
 *   [['nested', 'prop'], 'value']
 * ]
 *
 * @param obj a non-null, non-array `object`
 * @param flatEntriesOptions options (optional) - see {@link FlatEntriesOptions}
 * @returns [string[], unknown][] list of flat entries of the object
 */
export const flatEntries = (
  obj: object,
  flatEntriesOptions?: FlatEntriesOptions,
): FlatEntry[] => {
  const {
    preserveValuesForKeys = [],
  } = flatEntriesOptions ?? {};

  if (!isObjectValue(obj))
    throw new Error('input for flatEntries must be non-null non-array object');

  if (!Array.isArray(preserveValuesForKeys) || !preserveValuesForKeys.every(key => typeof key === 'string'))
    throw new Error('preserveValuesForKeys option must be a string array');

  const flattenEntriesRecursively = (
    input: unknown,
    layerKeys: string[] = [],
  ): FlatEntry[] => {
    const lastKey = layerKeys.length > 0 ? layerKeys.slice(-1)[0] : null;
    const keyIsNotToFlatten = lastKey !== null && preserveValuesForKeys.includes(lastKey);

    if (keyIsNotToFlatten || !isObjectValue(input))
      return [
        [layerKeys, input],
      ];

    return Object.entries(input)
      .flatMap(([key, value]) =>
        flattenEntriesRecursively(
          value,
          [...layerKeys, key],
        ));
  };

  return flattenEntriesRecursively(obj);
};
