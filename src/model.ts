export type FlatValue =
  undefined | null | boolean | string | number | Array<any> | Function;

export type ObjectValue = {
  [key: string]: ObjectValue | FlatValue
};

export type FlatEntry = [
  string[],
  ObjectValue | FlatValue,
];

export const isObjectValue = (value: unknown): value is ObjectValue =>
  value !== null && typeof value === 'object' && !Array.isArray(value);
