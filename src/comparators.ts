/**
 * Comparators for sorting various types of values.
 *
 * #### Peer Dependencies
 *
 * - [luxon](https://moment.github.io/luxon/) for Date and DateTime comparisons
 * - [string-natural-compare](https://www.npmjs.com/package/string-natural-compare) for natural string comparisons
 *
 * @module
 */
import { DateTime } from "luxon"
import naturalCompare from "string-natural-compare"
import type { Optional } from "./types.js"

/**
 * Compare two booelans, sorting false then true.
 *
 * The empty values `null` and `undefined` sort last.
 *
 * @param target the first boolean to compare
 * @param other the second boolean to compare
 * @returns false before true
 * @example Sort booleans false-true
 * ```ts
 * import { compareBooleansAsc } from "@trashpanda001/helpers/comparators"
 *
 * compareBooleansAsc(false, true)
 * // -1 .. false, true
 * compareBooleansAsc(true, false)
 * // 1 ... false, true
 * ```
 */
export function compareBooleansAsc(target: Optional<boolean>, other: Optional<boolean>) {
  if (target == null) {
    return other == null ? 0 : 1
  }
  if (other == null) {
    return -1
  }
  return target === other ? 0 : target ? 1 : -1
}

/**
 * Compare two booleans, sorting true then false.
 *
 * The empty values `null` and `undefined` sort last.
 *
 * @param target the first boolean to compare
 * @param other the second boolean to compare
 * @returns true before false
 * @example Sort booleans true-false
 * ```ts
 * import { compareBooleansDesc } from "@trashpanda001/helpers/comparators"
 *
 * compareBooleansDesc(true, false)
 * // -1 .. true, false
 * compareBooleansDes(false, true)
 * // 1 ... true, false
 * ```
 */
export function compareBooleansDesc(target: Optional<boolean>, other: Optional<boolean>) {
  if (target == null) {
    return other == null ? 0 : 1
  }
  if (other == null) {
    return -1
  }
  return target === other ? 0 : target ? -1 : 1
}

/**
 * Compare two dates, sorting earlier dates first.
 *
 * The empy values `null` and `undefined` sort last.
 *
 * @param target the first date to compare
 * @param other the second date to compare
 * @returns earlier dates first
 * @throws Error if Luxon is not available
 * @example Sort dates ascending
 * ```ts
 * import { compareDatesAsc } from "@trashpanda001/helpers/comparators"
 *
 * const earlier = new Date(2020, 0, 1)
 * const later = new Date(2021, 0, 1)
 * compareDatesAsc(earlier, later)
 * // -1 .. 2020-01-01, 2021-01-01
 * compareDatesAsc(later, earlier)
 * // 1 ... 2020-01-01, 2021-01-01
 * ```
 */
export function compareDatesAsc(target: Optional<Date | DateTime>, other: Optional<Date | DateTime>) {
  if (typeof DateTime == "undefined") {
    throw new Error("missing peer dependency 'luxon'")
  }
  const a_ = !target ? null : DateTime.isDateTime(target) ? target.toMillis() : target.getTime()
  const b_ = !other ? null : DateTime.isDateTime(other) ? other.toMillis() : other.getTime()
  return compareNumbersAsc(a_, b_)
}

/**
 * Compare two dates, sorting later dates first.
 *
 * The empy values `null` and `undefined` sort last.
 *
 * @param target the first date to compare
 * @param other the second date to compare
 * @returns later dates first
 * @throws Error if Luxon is not available
 *
 * @example Sort dates descending
 * ```ts
 * import { compareDatesDesc } from "@trashpanda001/helpers/comparators"
 *
 * const earlier = new Date(2020, 0, 1)
 * const later = new Date(2021, 0, 1)
 * compareDatesDesc(later, earlier)
 * // -1 .. 2021-01-01, 2020-01-01
 * compareDatesDesc(earlier, later)
 * // 1 ... 2021-01-01, 2020-01-01
 * ```
 */
export function compareDatesDesc(target: Optional<Date | DateTime>, other: Optional<Date | DateTime>) {
  if (typeof DateTime == "undefined") {
    throw new Error("missing peer dependency 'luxon'")
  }
  const a_ = !target ? null : DateTime.isDateTime(target) ? target.toMillis() : target.getTime()
  const b_ = !other ? null : DateTime.isDateTime(other) ? other.toMillis() : other.getTime()
  return compareNumbersDesc(a_, b_)
}

/**
 * Compare two numbers sorting in ascending order.
 *
 * The empty values `null` and `undefined` sort last.
 *
 * @param target the first number to compare
 * @param other the second number to compare
 * @returns smaller numbers first
 * @example Sort numbers ascending
 * ```ts
 * import { compareNumbersAsc } from "@trashpanda001/helpers/comparators"
 *
 * compareNumbersAsc(1, 2)
 * // -1 .. 1, 2
 * compareNumbersAsc(5, 4)
 * // 1 ... 4, 5
 * ```
 */
export function compareNumbersAsc(target: Optional<number>, other: Optional<number>) {
  return target != null ? (other != null ? target - other : -1) : other != null ? 1 : 0
}

/**
 * Compare two numbers sorting in descending order.
 *
 * The empty values `null` and `undefined` sort last.
 *
 * @param target the first number to compare
 * @param other the second number to compare
 * @returns larger numbers first
 * @example Sort numbers desscending
 * ```ts
 * import { compareNumbersDesc } from "@trashpanda001/helpers/comparators"
 *
 * compareNumbersDesc(5, 4)
 * // -1 .. 5, 4
 * compareNumbersDesc(1, 2)
 * // 1 ... 2, 1
 * ```
 */
export function compareNumbersDesc(target: Optional<number>, other: Optional<number>) {
  return target != null ? (other != null ? other - target : -1) : other != null ? 1 : 0
}

/**
 * Compare two strings with an alphabetic ordering.
 *
 * To sort strings with numbers in a human-friendly way, see `compareStringsNatural`. The empty
 * values  `""`, `null`, and `undefined` sort last.
 *
 * @param target the first string to compare
 * @param other the second string to compare
 * @returns alphabetic ordering
 * @example Sort strings alphabetically
 * ```ts
 * import { compareStrings } from "@trashpanda001/helpers/comparators"
 *
 * compareStrings("a", "b")
 * // -1 .. a, b
 * compareStrings("z", "y")
 * // 1 ... y, z
 * ```
 */
export function compareStrings(target: Optional<string>, other: Optional<string>) {
  return target ? (other ? target.localeCompare(other) : -1) : other ? 1 : 0
}

/**
 * Compare two strings with a natural alphabetic ordering (numbers sort properly).
 *
 * Empty values sort last: `""`, `null`, and `undefined` last.
 *
 * @param target the first string to compare
 * @param other the second string to compare
 * @returns alphabetic ordering, with numbers sorted naturally
 * @throws Error if string-natural-compare is not available
 * @example Sort strings with ascending numbers
 * ```ts
 * import { compareStringsNatural } from "@trashpanda001/helpers/comparators"
 *
 * compareStringsNatural("1 Dog", "2 Dogs")
 * // -1 .. 1 Dog, 2 Dogs
 * compareStringsNatural("9 Cats", "8 Cats")
 * // 1 ... 8 Cats, 9 Cats
 * ```
 */
export function compareStringsNatural(target: Optional<string>, other: Optional<string>) {
  if (typeof naturalCompare == "undefined") {
    throw new Error("missing peer dependency 'string-natural-compare'")
  }
  return target ? (other ? naturalCompare(target, other) : -1) : other ? 1 : 0
}

/**
 * Compare two strings with a natural reverse-alphabetic ordering (numbers sort properly).
 *
 * Empty values sort last: `""`, `null`, and `undefined` last.
 *
 * @param target the first string to compare
 * @param other the second string to compare
 * @returns reverse-alphabetic ordering, with numbers sorted naturally
 * @throws Error if string-natural-compare is not available
 * @example Sort strings with descending numbers
 * ```ts
 * import { compareStringsNaturalReversed } from "@trashpanda001/helpers/comparators"
 *
 * compareStringsNaturalReversed("1000 bottles", "999 bottles")
 * // -1 .. 1000 bottles, 999 bottles
 * compareStringsNaturalReversed("1 Mississippi", "2 Mississippi")
 * // 1 ... 2 Mississippi, 1 Mississippi
 * ```
 */
export function compareStringsNaturalReversed(target: Optional<string>, other: Optional<string>) {
  if (typeof naturalCompare == "undefined") {
    throw new Error("missing peer dependency 'string-natural-compare'")
  }
  return target ? (other ? naturalCompare(other, target) : -1) : other ? 1 : 0
}

/**
 * Compare two strings with a reverse-alphabetic ordering.
 *
 * To sort strings with numbers in a human-friendly way, see `compareStringsNaturalReversed`. The empty
 * values  `""`, `null`, and `undefined` sort last.
 *
 * @param target the first string to compare
 * @param other the second string to compare
 * @returns reverse-alphabetic ordering
 * @example Sort strings alphabetically in reverse order
 * ```ts
 * import { compareStringsReversed } from "@trashpanda001/helpers/comparators"
 *
 * compareStringsReversed("z", "y")
 * // -1 .. z, y
 * compareStringsReversed("a", "b")
 * // 1 ... b, a
 * ```
 */
export function compareStringsReversed(target: Optional<string>, other: Optional<string>) {
  return target ? (other ? other.localeCompare(target) : -1) : other ? 1 : 0
}
