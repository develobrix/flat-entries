/**
 * Flat entry of an object; 2-tuple consisting of
 * - `string[]` keys (= layers in the object)
 * - `T` generic flat value of the object at the position given by the keys (default type `unknown`)
 *
 * @example
 * // the flat entry instance
 * [['nested', 'prop'], 'value']
 * // represents the object
 * {
 *   nested: {
 *     prop: 'value',
 *   },
 * }
 */
export type FlatEntry<T = unknown> = [
  string[],
  T,
];

/**
 * returns true if passed value is a non-null non-array `object`
 * @param value value to check
 * @returns boolean `true` if value is a non-null non-array object
 */
export const isObjectValue = (value: unknown): value is object =>
  value !== null && typeof value === 'object' && !Array.isArray(value);
