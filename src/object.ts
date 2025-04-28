/**
 * Object utilities.
 *
 * @module
 */

/**
 * Gets a value from a nested structure via "dot-notation". Returns `undefined` if the path does not exist.
 *
 * @param object the object to search
 * @param path the dot-notation path to search for
 * @returns the value at the path or `undefined` if not found
 * @example
 * ```ts
 * import { getIn } from "@trashpanda001/helpers/object"
 *
 * getIn({a: {b: {c: 42 }}}, "a.b.c")
 * // 42
 * ```
 */
export function getIn(object: Readonly<Record<string, unknown>>, path: string) {
  return path.split(".").reduce((acc: unknown, key) => {
    if (acc != null && typeof acc == "object" && key in acc) {
      return (acc as Record<string, unknown>)[key]
    }
    return undefined
  }, object)
}

/**
 * Invert an object's key/values.
 *
 * Values are coerced to strings as an object's key must be a string. Duplicate values are overwritten
 * by the latest value.
 *
 * @param object the object to invert
 * @returns a new object with the keys and values inverted
 * @example
 * ```ts
 * import { invertObject } from "@trashpanda001/helpers/object"
 *
 * invertObject({ a: "alpha", b: "beta" })
 * // { alpha: "a", beta: "b" }
 * ```
 */
export function invertObject(object: Readonly<Record<string, PropertyKey>>) {
  return mapObject(object, ([key, value]) => [String(value), key])
}

/**
 * Given an object, map its entries (key, value) to a new key/value pair, and return a new object.
 *
 * If the mapping function generates duplicate keys, the latest entry wins.
 *
 * @param object the object to map
 * @param keyValueFn a function that takes an entry and returns a new entry
 * @returns a new object with the mapped entries
 * @example
 * ```ts
 * import { mapObject } from "@trashpanda001/helpers/object"
 *
 * objectMap({ a: "alpha", b: "beta" }, ([k, v]) => [k, v.toUpperCase()])
 * // { a: "ALPHA", b: "BETA" }
 * objectMap({ a: "alpha", b: "beta" }, ([k, v]) => [v, k.toUpperCase()])
 * // { alpha: "A", beta: "B" }
 * ```
 */
export function mapObject<T, S>(
  object: Readonly<Record<string, T>>,
  keyValueFn: (entry: [string, T]) => [string, S],
): Record<string, S> {
  return Object.fromEntries(Object.entries(object).map(keyValueFn))
}
