import { DateTime } from "luxon"
import naturalCompare from "string-natural-compare"

export type Optional<T> = null | T | undefined

/**
 * Compare two booelans, sorting false (0) then true (1). The empty values `null` and `undefined` sort last.
 *
 * @returns positive (a after b), negative (a before b), zero (original order)
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
 * Compare two booelans, sorting true (1) then false (0). The empty values `null` and `undefined` sort last.
 *
 * @returns positive (a after b), negative (a before b), zero (original order)
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
 * Compare two dates, sorting earlier dates first. The empy values `null` and `undefined` sort last.
 *
 * @returns positive (a after b), negative (a before b), zero (original order)
 * @throws Error if luxon is not available
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
 * Compare two dates, sorting later dates first. The empy values `null` and `undefined` sort last.
 *
 * @returns positive (a after b), negative (a before b), zero (original order)
 * @throws Error if luxon is not available
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
 * Compare two numbers sorting in ascending order. The empty values `null` and `undefined` sort last.
 *
 * @returns positive (a after b), negative (a before b), zero (original order)
 */
export function compareNumbersAsc(a: Optional<number>, b: Optional<number>) {
  return a != null ? (b != null ? a - b : -1) : b != null ? 1 : 0
}

/**
 * Compare two numbers sorting in descending order. The empty values `null` and `undefined` sort last.
 *
 * @returns positive (a after b), negative (a before b), zero (original order)
 */
export function compareNumbersDesc(a: Optional<number>, b: Optional<number>) {
  return a != null ? (b != null ? b - a : -1) : b != null ? 1 : 0
}

/**
 * Compare two strings with an alphabetic ordering. To sort strings with numbers in a human-friendly way, see
 * `compareStringsNatural`. The empty values  `""`, `null`, and `undefined` sort last.
 *
 * @returns positive (a after b), negative (a before b), zero (original order)
 */
export function compareStrings(a: Optional<string>, b: Optional<string>) {
  return a ? (b ? a.localeCompare(b) : -1) : b ? 1 : 0
}

/**
 * Compare two strings with a natural alphabetic ordering (numbers sort properly). Empty values sort last: `""`, `null`,
 * and `undefined` last.
 *
 * @returns positive (a after b), negative (a before b), zero (original order)
 */
export function compareStringsNatural(a: Optional<string>, b: Optional<string>) {
  return a ? (b ? naturalCompare(a, b) : -1) : b ? 1 : 0
}

/**
 * Compare two strings with a natural reverse-alphabetic ordering (numbers sort properly). Empty values sort last: `""`,
 * `null`, and `undefined` last.
 *
 * @returns positive (a after b), negative (a before b), zero (original order)
 */
export function compareStringsNaturalReversed(a: Optional<string>, b: Optional<string>) {
  if (typeof naturalCompare == "undefined") {
    throw new Error("missing peer dependency string-natural-compare")
  }
  return a ? (b ? naturalCompare(b, a) : -1) : b ? 1 : 0
}

/**
 * Compare two strings with a reverse-alphabetic ordering. To sort strings with numbers in a human-friendly way, see
 * `compareStringsNaturalReversed`. The empty values  `""`, `null`, and `undefined` sort last.
 *
 * @returns positive (a after b), negative (a before b), zero (original order)
 */
export function compareStringsReversed(a: Optional<string>, b: Optional<string>) {
  if (typeof naturalCompare == "undefined") {
    throw new Error("missing peer dependency string-natural-compare")
  }
  return a ? (b ? b.localeCompare(a) : -1) : b ? 1 : 0
}
