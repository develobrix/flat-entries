import { FlatEntry, FlatValue, isObjectValue, ObjectValue } from '../model';

export const fromFlatEntries = (entries: (string[] | ObjectValue | FlatValue)[][]): ObjectValue => {
  if (!isFlatEntryList(entries))
    throw new Error('input for fromFlatEntries from must be array of flat entries');

  return entries.reduce<ObjectValue>(
    (resultObject: ObjectValue, [keyLayers, value]: FlatEntry) =>
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
  obj: ObjectValue,
  keyLayers: string[],
  value: ObjectValue | FlatValue,
): ObjectValue => {
  const key = keyLayers[0];

  return {
    ...obj,
    [key]: keyLayers.length === 1
      ? value
      : insertRecursively(
        key in obj && isObjectValue(obj[key]) ? <ObjectValue>obj[key] : {},
        keyLayers.slice(1),
        value,
      ),
  };
};
