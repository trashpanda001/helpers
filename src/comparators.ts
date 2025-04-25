import { DateTime } from "luxon"
import naturalCompare from "string-natural-compare"

export type Optional<T> = null | T | undefined

/**
 * Compare two booelans, sorting false then true.
 *
 * The empty values `null` and `undefined` sort last.
 *
 * @example Sort booleans false-true
 * ```ts
 * import { compareBooleansAsc } from "@trashpanda001/helpers/comparators"
 *
 * compareBooleansAsc(false, true)
 * // -1
 * compareBooleansAsc(true, false)
 * // 1
 * ```
 */
export function compareBooleansAsc(a: Optional<boolean>, b: Optional<boolean>) {
  if (a == null) {
    return b == null ? 0 : 1
  }
  if (b == null) {
    return -1
  }
  return a === b ? 0 : a ? 1 : -1
}

/**
 * Compare two booleans, sorting true then false.
 *
 * The empty values `null` and `undefined` sort last.
 *
 * @example Sort booleans true-false
 * ```ts
 * import { compareBooleansDesc } from "@trashpanda001/helpers/comparators"
 *
 * compareBooleansDesc(true, false)
 * // -1
 * compareBooleansDes(false, true)
 * // 1
 * ```
 */
export function compareBooleansDesc(a: Optional<boolean>, b: Optional<boolean>) {
  if (a == null) {
    return b == null ? 0 : 1
  }
  if (b == null) {
    return -1
  }
  return a === b ? 0 : a ? -1 : 1
}

/**
 * Compare two dates, sorting earlier dates first.
 *
 * The empy values `null` and `undefined` sort last.
 *
 * @throws Error if luxon is not available
 *
 * @example Sort dates ascending
 * ```ts
 * import { compareDatesAsc } from "@trashpanda001/helpers/comparators"
 *
 * const earlier = new Date(2020, 0, 1)
 * const later = new Date(2021, 0, 1)
 * compareDatesAsc(earlier, later)
 * // -1
 * compareDatesAsc(later, earlier)
 * // 1
 * ```
 */
export function compareDatesAsc(a: Optional<Date | DateTime>, b: Optional<Date | DateTime>) {
  if (typeof DateTime == "undefined") {
    throw new Error("missing peer dependency luxon")
  }
  const a_ = !a ? null : DateTime.isDateTime(a) ? a.toMillis() : a.getTime()
  const b_ = !b ? null : DateTime.isDateTime(b) ? b.toMillis() : b.getTime()
  return compareNumbersAsc(a_, b_)
}

/**
 * Compare two dates, sorting later dates first.
 *
 * The empy values `null` and `undefined` sort last.
 *
 * @throws Error if luxon is not available
 *
 * @example Sort dates descending
 * ```ts
 * import { compareDatesDesc } from "@trashpanda001/helpers/comparators"
 *
 * const earlier = new Date(2020, 0, 1)
 * const later = new Date(2021, 0, 1)
 * compareDatesDesc(later, earlier)
 * // -1
 * compareDatesDesc(earlier, later)
 * // 1
 * ```
 */
export function compareDatesDesc(a: Optional<Date | DateTime>, b: Optional<Date | DateTime>) {
  if (typeof DateTime == "undefined") {
    throw new Error("missing peer dependency luxon")
  }
  const a_ = !a ? null : DateTime.isDateTime(a) ? a.toMillis() : a.getTime()
  const b_ = !b ? null : DateTime.isDateTime(b) ? b.toMillis() : b.getTime()
  return compareNumbersDesc(a_, b_)
}

/**
 * Compare two numbers sorting in ascending order.
 *
 * The empty values `null` and `undefined` sort last.
 *
 * @example Sort numbers ascending
 * ```ts
 * import { compareNumbersAsc } from "@trashpanda001/helpers/comparators"
 *
 * compareNumbersAsc(1, 2)
 * // -1
 * compareNumbersAsc(5, 4)
 * // 1
 * ```
 */
export function compareNumbersAsc(a: Optional<number>, b: Optional<number>) {
  return a != null ? (b != null ? a - b : -1) : b != null ? 1 : 0
}

/**
 * Compare two numbers sorting in descending order.
 *
 * The empty values `null` and `undefined` sort last.
 *
 * @example Sort numbers desscending
 * ```ts
 * import { compareNumbersDesc } from "@trashpanda001/helpers/comparators"
 *
 * compareNumbersDesc(5, 4)
 * // -1
 * compareNumbersDesc(1, 2)
 * // 1
 * ```
 */
export function compareNumbersDesc(a: Optional<number>, b: Optional<number>) {
  return a != null ? (b != null ? b - a : -1) : b != null ? 1 : 0
}

/**
 * Compare two strings with an alphabetic ordering.
 *
 * To sort strings with numbers in a human-friendly way, see `compareStringsNatural`. The empty
 * values  `""`, `null`, and `undefined` sort last.
 *
 * @example Sort strings alphabetically
 * ```ts
 * import { compareStrings } from "@trashpanda001/helpers/comparators"
 *
 * compareStrings("a", "b")
 * // -1
 * compareStrings("z", "y")
 * // 1
 * ```
 */
export function compareStrings(a: Optional<string>, b: Optional<string>) {
  return a ? (b ? a.localeCompare(b) : -1) : b ? 1 : 0
}

/**
 * Compare two strings with a natural alphabetic ordering (numbers sort properly).
 *
 * Empty values sort last: `""`, `null`, and `undefined` last.
 *
 * @example Sort strings with numbers naturally
 * ```ts
 * import { compareStringsNatural } from "@trashpanda001/helpers/comparators"
 *
 * compareStringsNatural("1 Dog", "2 Dogs")
 * // -1
 * compareStringsNatural("9 Cats", "8 Cats")
 * // 1
 * ```
 */
export function compareStringsNatural(a: Optional<string>, b: Optional<string>) {
  return a ? (b ? naturalCompare(a, b) : -1) : b ? 1 : 0
}

/**
 * Compare two strings with a natural reverse-alphabetic ordering (numbers sort properly).
 *
 * Empty values sort last: `""`, `null`, and `undefined` last.
 *
 * @example Sort strings with numbers naturally in reverse order
 * ```ts
 * import { compareStringsNaturalReversed } from "@trashpanda001/helpers/comparators"
 *
 * compareStringsNaturalReversed("1000 bottles", "999 bottles")
 * // -1
 * compareStringsNaturalReversed("1 Mississippi", "2 Mississippi")
 * // 1
 * ```
 */
export function compareStringsNaturalReversed(a: Optional<string>, b: Optional<string>) {
  if (typeof naturalCompare == "undefined") {
    throw new Error("missing peer dependency string-natural-compare")
  }
  return a ? (b ? naturalCompare(b, a) : -1) : b ? 1 : 0
}

/**
 * Compare two strings with a reverse-alphabetic ordering.
 *
 * To sort strings with numbers in a human-friendly way, see `compareStringsNaturalReversed`. The empty
 * values  `""`, `null`, and `undefined` sort last.
 *
 * @example Sort strings alphabetically in reverse order
 * ```ts
 * import { compareStringsReversed } from "@trashpanda001/helpers/comparators"
 *
 * compareStringsReversed("z", "y")
 * // -1
 * compareStringsReversed("a", "b")
 * // 1
 * ```
 */
export function compareStringsReversed(a: Optional<string>, b: Optional<string>) {
  if (typeof naturalCompare == "undefined") {
    throw new Error("missing peer dependency string-natural-compare")
  }
  return a ? (b ? b.localeCompare(a) : -1) : b ? 1 : 0
}
