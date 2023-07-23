import { FlatEntry, FlatValue, isObjectValue, ObjectValue } from '../model';

export const flatEntries = (obj: object): FlatEntry[] => {
  if (!isObjectValue(obj))
    throw new Error('input for flatEntries must be non-null non-array object');

  return flattenEntriesRecursively(obj);
};

const flattenEntriesRecursively = (
  input: ObjectValue | FlatValue,
  layerKeys: string[] = [],
): FlatEntry[] => {
  if (!isObjectValue(input))
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
