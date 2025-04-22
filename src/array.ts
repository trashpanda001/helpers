/**
 * Breaks a string or array into chunks of size `count`. The last chunk may contain less than
 * `count` items.
 *
 * @param {string|Array<*>} stringOrArray - a string or array
 * @param {number} count - split into chunks of this size.
 * @returns {Array<*>} chunked array
 */
export function chunkEvery(stringOrArray, count) {
  const result = []
  for (let i = 0; i < stringOrArray.length; i += count) {
    result.push(stringOrArray.slice(i, i + count))
  }
  return result
}

/**
 * Similar to `find`, but returns the value of the function invocation instead of the element itself. The return value
 * is considered to be found when the result is NOT `false`.
 *
 * @example
 * findValue([2,3,4], (x) => x > 2 ? x * x : false)
 * // 9
 *
 * @param {Array<*>} array - array to search
 * @param {*|undefined} defaultValue - default value (defaults to `null` if undefined)
 * @param {Function} fn - function to call with each element
 * @returns {*} value of function of the default value
 */
export function findValue(array, defaultValue = null, fn) {
  const callback = fn !== undefined ? fn : defaultValue
  const fallbackValue = fn !== undefined ? defaultValue : null

  for (let i = 0; i < array.length; i++) {
    const value = callback(array[i])
    if (value !== false) {
      return value
    }
  }

  return fallbackValue
}

/**
 * Splits an array into groups based on `keyFn`.
 *
 * The result is an object where each key is given by `keyFn` and each value is an array of elements given by `valueFn`.
 * The order of elements within each list is preserved from the original array.
 *
 * @param {Array<*>} array - array to group
 * @param {Function} keyFn - key function (e.g. `(string) => string.length`)
 * @param {Function?} valueFn - optional value function (defaults to `(x) => x`)
 * @returns {Object} map
 */
export const groupBy = (array, keyFn, valueFn = (x) => x) =>
  array.reduce((acc, x) => ((acc[keyFn(x)] ||= []).push(valueFn(x)), acc), {})

/**
 * Creates a new shuffled array via the Durtenfeld shuffle algorithm.
 *
 * @example
 * shuffleArray([1, 2, 3, 4, 5])
 * // [2, 4, 1, 5, 3]
 *
 * @param {Array<*>} input - input array
 * @returns {Array<*>} shuffled array
 */
export function shuffleArray(input) {
  const array = [...input]
  for (let i = array.length - 1; i > 0; i--) {
    const j = randomInt(0, i + 1)
    ;[array[i], array[j]] = [array[j], array[i]]
  }
  return array
}

/**
 * A stable array sort using a mapping function. This implements the Lisp decorate-sort-undecorate
 * pattern (aka Schwartzian transform): it first maps all the elements, then sorts by the mapped value,
 * and then returns an array of the original elements. If two elements map to the same value, the
 * original element order is preserved.
 *
 * @example
 * sortBy(data, (e) => parseISO(e.created_at), (a,b) => b - a)
 * // data sorted by created_at from latest to earliest
 *
 * @param {Array<*>} array - original array
 * @param {function} mapper - mapping function
 * @param {function} comparator - comparator function
 * @returns {Array<*>} sorted array
 */
export const sortBy = (array, mapper, comparator) =>
  array
    .map((e, i) => [e, mapper(e), i])
    .sort((a, b) => {
      const result = comparator(a[1], b[1])
      return result == 0 ? a[2] - b[2] : result // if equal, use original element order
    })
    .map((e) => e[0])

/**
 * Return an array with the results of invoking the callback function with `i` where `0 <= i < n`.
 *
 * @example
 * times(2, "french hen") // ["french hen", "french hen"]
 * times(2, i => <div key={i}>{i}</div>) // JSX <div key="0">0</div><div key="1">1</div>
 * times(2) // [0, 1]
 *
 * @param {number} n - repeat this many times
 * @param {*|function|undefined} valueOrFunction - if undefined, uses the identity function
 * @returns {*[]} array of `n` elements, the result of each function call
 */
export function times(n, value = identity) {
  const array = Array(n)
  if (typeof value === "function") {
    return array.fill().map((_, index) => value(index))
  }
  return array.fill(value)
}

/**
 * Return a copy of the array removing all duplicated elements. The order of the elements is
 * preserved.
 *
 * @example
 * uniq([1, 2, 3, 4, 3, 2, 1])
 * // [1, 2, 3, 4]
 *
 * @param {*[]} array - an array
 * @returns {*[]} array without duplicates
 */
export const uniq = (array) => [...new Set(array)] // JS sets are iterable in insertion order!!

/**
 * Returns a new array that removes elements for which `uniqFn` returned duplicate elements. The first occurrence of
 * each element is kept.
 *
 * @example
 * uniqBy(["cat", "dog", "raccoon", "meow", "woof"], (x) => x.length)
 * // ["cat", "raccoon", "meow"]
 *
 * @param {*[]} array - an array
 * @param {function} uniqFn - a mapper function
 * @returns {*[]} array without duplicates, based on mapping each element to a value
 */
export function uniqBy(array, uniqFn) {
  const set = new Set()
  const newArray = []
  array.forEach((element) => {
    const value = uniqFn(element)
    if (!set.has(value)) {
      set.add(value)
      newArray.push(element)
    }
  })
  return newArray
}
