import { FlatEntry, FlatValue, isObjectValue, ObjectValue } from '../model';

export type FlatEntriesOptions = {
  preserveValuesForKeys: string[]
}

export const flatEntries = (
  obj: object,
  flatEntriesOptions?: FlatEntriesOptions
): FlatEntry[] => {
  const {
    preserveValuesForKeys = []
  } = flatEntriesOptions ?? {};

  if (!isObjectValue(obj))
    throw new Error('input for flatEntries must be non-null non-array object');

  if (!Array.isArray(preserveValuesForKeys) || !preserveValuesForKeys.every(key => typeof key === 'string'))
    throw new Error('preserveValuesForKeys option must be a string array');

  const flattenEntriesRecursively = (
    input: ObjectValue | FlatValue,
    layerKeys: string[] = [],
  ): FlatEntry[] => {
    const lastKey = layerKeys.length > 0 ? layerKeys.slice(-1)[0] : null;
    const keyIsNotToFlatten = lastKey !== null && preserveValuesForKeys.includes(lastKey);

    if (keyIsNotToFlatten || !isObjectValue(input))
      return [
        [
          layerKeys,
          input,
        ],
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
