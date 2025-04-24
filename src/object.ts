// /**
//  * Gets a value from a nested structure via "dot-notation".
//  *
//  * @returns the value or undefined if the path does not exist
//  * @example
//  * ```ts
//  * getIn({a: {b: {c: 42 }}}, "a.b.c")  // 42
//  * ```
//  */
// // eslint-disable-next-line @typescript-eslint/no-explicit-any
// export const getIn = (object: Record<string, any>, path: string): any =>
//   path.split(".").reduce((acc, key) => acc?.[key], object)

/**
 * Given an object, map its entries (key, value) to a new key/value pair, and return a new object. If the mapping
 * function generates duplicate keys, the latest entry wins.
 *
 * @example
 * ```ts
 * objectMap({ a: "alpha", b: "beta" }, ([key, value]) => [value, key])  // { alpha: "a", beta: "b" }
 * ```
 */
export function mapObject<T, S>(
  object: Record<string, T>,
  keyValueFn: (entry: [string, T]) => [string, S],
): Record<string, S> {
  return Object.fromEntries(Object.entries(object).map(keyValueFn))
}

/**
 * Invert an object's key/values. Values are coerced to strings as an object's key must be a string.
 * Duplicate values are overwritten by the latest value.
 *
 * @example
 * ```ts
 * invertObject({ a: "alpha", b: "beta" })  // { alpha: "a", beta: "b" }
 * ```
 */
export const invertObject = (object: Record<string, PropertyKey>) =>
  mapObject(object, ([key, value]) => [value.toString(), key])
