import { FlatEntry, FlatValue, isObjectValue, ObjectValue } from '../model';

export const fromFlatEntries = (entries: (string[] | FlatValue)[][]): ObjectValue => {
  if (!isFlatEntryList(entries))
    throw new Error('input for fromFlatEntries from must be array of flat entries');

  return entries.reduce<ObjectValue>(
    (resultObject: ObjectValue, [keyLayers, flatValue]: FlatEntry) =>
      insertRecursively(
        resultObject,
        keyLayers,
        flatValue,
      ),
    {},
  );
};

const isFlatEntryList = (value: unknown): value is FlatEntry[] =>
  Array.isArray(value) && value.every(isFlatEntry);

const isFlatEntry = (value: unknown): value is FlatEntry =>
  Array.isArray(value)
  && value.length === 2
  && Array.isArray(value[0])
  && value[0].length > 0
  && value[0].every(entry => typeof entry === 'string');

const insertRecursively = (
  obj: ObjectValue,
  keyLayers: string[],
  flatValue: FlatValue,
): ObjectValue => {
  const key = keyLayers[0];

  return {
    ...obj,
    [key]: keyLayers.length === 1
      ? flatValue
      : insertRecursively(
        key in obj && isObjectValue(obj[key]) ? <ObjectValue>obj[key] : {},
        keyLayers.slice(1),
        flatValue,
      ),
  };
};
