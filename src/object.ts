/**
 * Object utilities.
 *
 * @module
 */

/**
 * Gets a value from a nested structure via "dot-notation". Returns `undefined` if the path does not exist.
 *
 * @param object - the object to search
 * @param path - the dot-notation path to search for
 * @returns the value at the path or `undefined` if not found
 *
 * @example
 * ```ts
 * import { getIn } from "@trashpanda001/helpers/object"
 *
 * getIn({a: {b: {c: 42 }}}, "a.b.c")
 * // 42
 * ```
 */
export function getIn(object: Readonly<Record<string, unknown> | unknown[]>, path: string) {
  return path.split(".").reduce((acc: unknown, key) => {
    if (acc != null && typeof acc == "object") {
      if (Array.isArray(acc) && !isNaN(Number(key))) {
        return (acc as unknown[])[Number(key)]
      }
      if (key in acc) {
        return (acc as Record<string, unknown>)[key]
      }
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
 * @param object - the object to invert
 * @returns a new object with the keys and values inverted
 *
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
 * @param object - the object to map
 * @param keyValueFn - a function that takes an entry and returns a new entry
 * @returns a new object with the mapped entries
 *
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

/**
 * Puts a value into a nested structure via "dot-notation" (mutates object). Traverses nested objects
 * and arrays, creating new nested objects/arrays as needed.
 *
 * @param object - a mutable object
 * @param path - a dot-notation path
 * @param value - a value
 *
 * @example
 * ```ts
 * import { putIn } from "@trashpanda001/helpers/object"
 *
 * const x = { a: { b: { c: 42 } } }
 * putIn(x, "a.b.c", { d: 123 })
 * // x = { a: { b: { c: { d: 123 } } }
 *
 * const y = { a: [{ c: 42 }] }
 * putIn(y, "a.1", { c: 100 })
 * // y = { a: [{ c: 42 }, { c: 100 }] }
 * ```
 */
export function putIn(object: Record<string, unknown> | unknown[], path: string, value: unknown) {
  if (path == "") {
    return
  }
  const keys = path.split(".")
  const leafIndex = keys.length - 1
  keys.reduce((acc: unknown, key, keyIndex) => {
    const index = Number(key)
    const isNumeric = !isNaN(index)

    // sanity checks
    if (Array.isArray(acc)) {
      if (!isNumeric) {
        throw new Error(`attempting to access array with key "${key}"`)
      }
    } else if (acc != null && typeof acc == "object") {
      if (isNumeric) {
        throw new Error(`attempting to access object with numeric index ${index}`)
      }
    } else {
      throw new Error("encountered a non-array, non-object value")
    }

    // set value for leaf
    if (keyIndex == leafIndex) {
      if (isNumeric) {
        return ((acc as unknown[])[index] = value)
      }
      return ((acc as Record<string, unknown>)[key] = value)
    }

    // traverse existing child
    const child = isNumeric ? (acc as unknown[])[index] : (acc as Record<string, unknown>)[key]
    if (child !== undefined) {
      return child
    }

    // create new array/object child based on next key type
    const newChild = isNaN(Number(keys[keyIndex + 1])) ? {} : []
    if (isNumeric) {
      return ((acc as unknown[])[index] = newChild)
    }
    return ((acc as Record<string, unknown>)[key] = newChild)
  }, object)
}
