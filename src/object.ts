/**
 * Gets a value from a nested structure via "dot-notation". Returns `undefined` if the path does not exist.
 *
 * @example
 * ```ts
 * getIn({a: {b: {c: 42 }}}, "a.b.c")  // 42
 * ```
 */
export function getIn(object: Record<string, unknown>, path: string) {
  return path.split(".").reduce((acc: unknown, key) => {
    if (acc != null && typeof acc == "object" && key in acc) {
      return (acc as Record<string, unknown>)[key]
    }
    return undefined
  }, object)
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
export function invertObject(object: Record<string, PropertyKey>) {
  return mapObject(object, ([key, value]) => [value.toString(), key])
}

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
