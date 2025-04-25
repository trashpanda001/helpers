import { identity } from "./function.js"

/**
 * Breaks an array into chunks of size `chunkSize`. The last chunk may contain less than `chunkSize` items.
 *
 * @example
 * ```ts
 * chunkEvery([1, 2, 3, 4, 5], 2)
 * // [[1, 2], [3, 4], [5]]
 * ```
 */
export function chunkEvery<T>(array: T[], chunkSize: number) {
  if (!(Number.isInteger(chunkSize) && chunkSize > 0)) {
    throw new RangeError("Chunk size must be a positive integer")
  }
  const result = []
  for (let i = 0; i < array.length; i += chunkSize) {
    result.push(array.slice(i, i + chunkSize))
  }
  return result
}

/**
 * Similar to `find`, but returns the value of the function invocation instead of the element itself. The
 * return value is considered to be found when the result is NOT `false`. Returns `undefined` if no value is found.
 *
 * @example
 * ```ts
 * findValue([2,3,4], (x) => x > 2 ? x * x : undefined)
 * // 9
 * ```
 */
export function findValue<T, S>(array: T[], fn: (x: T) => S | undefined) {
  for (let i = 0; i < array.length; i++) {
    const value = fn(array[i]!)
    if (value !== undefined) {
      return value as S
    }
  }
}

/**
 * Splits an array into groups based on `keyFn`.
 *
 * The result is an object where each key is given by `keyFn` and each value is an array of elements given by `valueFn`.
 * The order of elements within each list is preserved from the original array.
 *
 * @example
 * ```ts
 * groupBy(["one", "two", "three", "four", "five"], (x) => x.length)
 * // { "3": ["one", "two"], "4": ["four", "five"], "5": ["three"] }
 * ```
 */
export function groupBy<T, K extends PropertyKey, V = T>(array: T[], keyFn: (x: T) => K, valueFn?: (x: T) => V) {
  const valueFn_ = valueFn ?? (identity as (x: T) => V)
  return array.reduce(
    (acc, x) => {
      const key = keyFn(x)
      const value = valueFn_(x)
      const group = (acc[key] ??= [])
      group.push(value)
      return acc
    },
    {} as Record<K, V[]>,
  )
}

/**
 * Creates a new shuffled array via the Durtenfeld shuffle algorithm.
 *
 * @example
 * ```ts
 * shuffle([1, 2, 3, 4, 5])  // [2, 4, 1, 5, 3]
 * ```
 */
export function shuffle<T>(input: T[]) {
  const array = [...input]
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[array[i], array[j]] = [array[j]!, array[i]!]
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
 * ```ts
 * sortBy(data, (e) => parseISO(e.created_at), (a,b) => b - a)
 * // data sorted by created_at from latest to earliest
 * ```
 */
export function sortBy<T, V>(array: T[], mapper: (x: T) => V, comparator: (a: V, b: V) => number) {
  return array
    .map((e, i) => [e, mapper(e), i] as [T, V, number]) // add index to preserve original order
    .sort((a, b) => {
      const result = comparator(a[1], b[1])
      return result == 0 ? a[2] - b[2] : result // if equal, use original element order
    })
    .map((e) => e[0])
}

/**
 * Return an array with the results of invoking a value or callback for each index `0 <= i < n`.
 *
 * @example
 * ```ts
 * times(3)            // [0, 1, 2]
 * times(3, i => i*i)  // [0, 1, 4]
 * ```
 */
export function times<T>(n: number, mapFn?: (i: number) => T) {
  const fn = mapFn ?? (identity as (i: number) => T)
  return Array.from({ length: n }, (_, i) => fn(i))
}

/**
 * Return a copy of the array removing all duplicated elements. The order of the elements is
 * preserved.
 *
 * @example
 * ```ts
 * uniq([1, 2, 3, 4, 3, 2, 1])  // [1, 2, 3, 4]
 * ```
 */
export function uniq<T>(array: T[]) {
  return [...new Set(array)] // JS sets are iterable in insertion order
}

/**
 * Returns a new array that removes elements for which `uniqFn` returned duplicate elements. The first occurrence of
 * each element is kept.
 *
 * @returns array without duplicates, based on mapping each element to a value
 * @example
 * ```ts
 * uniqBy(["cat", "dog", "raccoon", "meow", "woof"], (x) => x.length)
 * // ["cat", "raccoon", "meow"]
 * ```
 */
export function uniqBy<T, S>(array: T[], uniqFn: (x: T) => S) {
  const set = new Set<S>()
  const newArray: T[] = []
  array.forEach((element) => {
    const value = uniqFn(element)
    if (!set.has(value)) {
      set.add(value)
      newArray.push(element)
    }
  })
  return newArray
}
