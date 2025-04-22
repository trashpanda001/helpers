/**
 * Gets a value from a nested structure via "dot-notation".
 *
 * @example
 * getIn({a: {b: {c: 42 }}}, "a.b.c")
 * // 42
 *
 * @param {Object} object - an object
 * @param {string} path - path in dot notation
 * @returns {*|undefined} value
 */
export const getIn = (object, path) => path.split(".").reduce((acc, key) => acc?.[key], object)

/**
 * Given an object, map its entries (key, value) to a new key/value pair, and return a new object. If the mapping
 * function generates duplicate keys, the latest entry wins.
 *
 * @example
 * objectMap({ a: "alpha", b: "beta" }, (kv) => kv.reverse())
 * // { alpha: "a", beta: "b" }
 *
 * @param {Object} object - an object
 * @param {Function} keyValueFn - function that takes an array of `[key, value]` and returns `[mappedKey, mappedValue]`
 * @returns {Object} result object
 */
export const mapObject = (object, keyValueFn) => Object.fromEntries(Object.entries(object).map(keyValueFn))

/**
 * Invert an object's key/values. Values are coerced to strings as an object's key must be a string.
 * Duplicate values are overwritten by the latest value.
 *
 * @example
 * invertObject({ a: "alpha", b: "beta" })
 * // { alpha: "a", beta: "b" }
 *
 * @param {Object} object - an object
 * @returns {Object} inverted object
 */
export const invertObject = (object) => mapObject(object, (kv) => kv.reverse())
