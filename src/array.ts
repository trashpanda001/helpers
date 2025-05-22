/**
 * Array utilities.
 *
 * @module
 */
import { identity } from "./function.js"
import type { Primitive } from "./types.js"

export type { Primitive }

/** Sentinel value to continue execution. */
export const CONTINUE = Symbol.for("CONTINUE")

/**
 * Breaks an array into chunks of size `chunkSize`.
 *
 * The last chunk may contain less than `chunkSize` items.
 *
 * @param array - the array to chunk
 * @param chunkSize - a positive integer
 * @returns an array of arrays
 *
 * @example
 * Chunk into groups of 2.
 * ```ts
 * import { chunkEvery } from "@trashpanda001/helpers/array"
 *
 * chunkEvery([1, 2, 3, 4, 5], 2)
 * // [[1, 2], [3, 4], [5]]
 * ```
 */
export function chunkEvery<T>(array: readonly T[], chunkSize: number) {
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
 * Like `find`, but returns the value of the function invocation instead of the element itself.
 *
 * The return value is considered to be found if `fn` returns a value other than `CONTINUE`.
 *
 * @param array - the array to search
 * @param fn - a function given an element that returns the final value or `CONTINUE`
 * @returns the first value found or `undefined`
 *
 * @example
 * Find the first element that is greater than 2 and return its square.
 * ```ts
 * import { CONTINUE, findValue } from "@trashpanda001/helpers/array"
 *
 * findValue([2, 3, 4], (x) => x > 2 ? x * x : CONTINUE)
 * // 9 -- found 3, result of 3 * 3
 * [2, 3, 4].find((x) => x > 2)
 * // 3 -- found 3, result of 3
 * [2, 3, 4].findIndex((x) => x > 2)
 * // 1 -- found 3, index of 1
 * ```
 */
export function findValue<T, S>(array: readonly T[], fn: (x: T) => S | typeof CONTINUE) {
  for (let i = 0; i < array.length; i++) {
    const value = fn(array[i]!)
    if (value !== CONTINUE) {
      return value as S
    }
  }
  return undefined
}

/**
 * Splits an array into groups based on `keyFn`.
 *
 * The result is an object where each key is given by `keyFn` and each value is an array of elements
 * given by `valueFn`. The order of elements within each list is preserved from the original array.
 *
 * @param array - the array to group
 * @param keyFn - a function that returns the key for each element
 * @param valueFn - a function that returns the value for each element
 * @returns an object that maps group keys to arrays of elements/values
 *
 * @example
 * Group elements by their string length.
 * ```ts
 * import { groupBy } from "@trashpanda001/helpers/array"
 *
 * groupBy(["one", "two", "three", "four", "five"], (x) => x.length)
 * // { "3": ["one", "two"], "4": ["four", "five"], "5": ["three"] }
 * groupBy(["one", "two", "three", "four", "five"], (x) => x.length, (x) => x.toUpperCase())
 * // { "3": ["ONE", "TWO"], "4": ["FOUR", "FIVE"], "5": ["THREE"] }
 * ```
 */
export function groupBy<T, K extends PropertyKey, V = T>(
  array: readonly T[],
  keyFn: (x: T) => K,
  valueFn: (x: T) => V = identity as (x: T) => V,
) {
  return array.reduce(
    (acc, x) => {
      const key = keyFn(x)
      const value = valueFn(x)
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
 * https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle#The_modern_algorithm
 *
 * @param array - the array to shuffle
 * @returns a new shuffled array
 *
 * @example
 * Shuffle an array.
 * ```ts
 * import { shuffle } from "@trashpanda001/helpers/array"
 *
 * shuffle([1, 2, 3, 4, 5])
 * // [2, 4, 1, 5, 3]
 * ```
 */
export function shuffle<T>(array: readonly T[]) {
  const newArray = [...array]
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[newArray[i], newArray[j]] = [newArray[j]!, newArray[i]!]
  }
  return newArray
}

/**
 * A stable array sort using a mapping function.
 *
 * This implements the Lisp decorate-sort-undecorate pattern (aka Schwartzian transform): it first maps
 * all the elements, then sorts by the mapped value, and then returns an array of the original elements.
 * If two elements map to the same value, the original element order is preserved.
 *
 * @param array - the array to sort
 * @param mapFn - a function that maps each element to a value
 * @param compareFn - a function that compares two mapped values
 * @returns a new sorted array
 *
 * @example
 * Sort by absolute value ascending.
 * ```ts
 * import { sortBy } from "@trashpanda001/helpers/array"
 *
 * sortBy([-3, -1, 2], (x) => Math.abs(x), (a, b) => a - b)
 * // [-1, 2, -3]
 * ```
 */
export function sortBy<T, V>(array: readonly T[], mapFn: (x: T) => V, compareFn: (a: V, b: V) => number) {
  return array
    .map((e, i) => [e, mapFn(e), i] as const) // add index to preserve original order
    .sort((a, b) => {
      const result = compareFn(a[1], b[1])
      return result == 0 ? a[2] - b[2] : result // if equal, use original element order
    })
    .map((e) => e[0])
}

/**
 * Return an array with the results of invoking `mapFn` for each index.
 *
 * @param n - a non-negative integer
 * @param mapFn - a function that returns the value for each index
 * @returns an array of length `n`
 *
 * @example
 * Three times.
 * ```ts
 * import { times } from "@trashpanda001/helpers/array"
 *
 * times(3)
 * // [0, 1, 2]
 * times(3, (i) => i * i)
 * // [0, 1, 4]
 * ```
 */
export function times<T>(n: number, mapFn: (i: number) => T = identity as (i: number) => T) {
  return Array.from({ length: n }, (_, i) => mapFn(i))
}

/**
 * Return a copy of the array removing all duplicated elements.
 *
 * The order of the elements is preserved.
 *
 * @param array - the input array
 * @returns a new array with unique elements
 *
 * @example
 * Unique numbers.
 * ```ts
 * import { uniq } from "@trashpanda001/helpers/array"
 *
 * uniq([1, 2, 3, 4, 3, 2, 1])
 * // [1, 2, 3, 4]
 * ```
 */
export function uniq<T extends Primitive>(array: readonly T[]) {
  return [...new Set(array)]
}

/**
 * Returns a new array that removes elements for which `uniqFn` returned duplicate elements.
 *
 * The first occurrence of each element is kept.
 *
 * @param array - the input array
 * @param uniqFn - a function that returns the value to check for duplicates
 * @returns a new array with unique elements
 *
 * @example
 * Unique elements by length.
 * ```ts
 * import { uniqBy } from "@trashpanda001/helpers/array"
 *
 * uniqBy(["cat", "dog", "raccoon", "meow", "woof"], (x) => x.length)
 * // ["cat", "raccoon", "meow"]
 * ```
 */
export function uniqBy<T, S extends Primitive>(array: readonly T[], uniqFn: (x: T) => S) {
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
