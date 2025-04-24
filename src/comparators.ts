import { DateTime } from "luxon"
import naturalCompare from "string-natural-compare"

/**
 * Compare two booelans, sorting false (0) then true (1). The empty values `null` and `undefined` sort last.
 *
 * @param {number|null|undefined} a - first number
 * @param {number|null|undefined} b - second number
 * @returns {number} - positive (a after b), negative (a before b), zero (original order)
 */
export const compareBooleansAsc = (a, b) => (a === b ? 0 : b ? -1 : 1)

/**
 * Compare two booelans, sorting true (1) then false (0). The empty values `null` and `undefined` sort last.
 *
 * @param {number|null|undefined} a - first number
 * @param {number|null|undefined} b - second number
 * @returns {number} - positive (a after b), negative (a before b), zero (original order)
 */
export const compareBooleansDesc = (a, b) => (a === b ? 0 : a ? -1 : 1)

/**
 * Compare two numbers sorting in ascending order. The empty values `null` and `undefined` sort last.
 *
 * @param {number|null|defined} a - first number
 * @param {number|null|defined} b - second number
 * @returns {number} - positive (a after b), negative (a before b), zero (original order)
 */
export const compareNumbersAsc = (a, b) => (a != null ? (b != null ? a - b : -1) : b != null ? 1 : 0)

/**
 * Compare two numbers sorting in descending order. The empty values `null` and `undefined` sort last.
 *
 * @param {number|null|defined} a - first number
 * @param {number|null|defined} b - second number
 * @returns {number} - positive (a after b), negative (a before b), zero (original order)
 */
export const compareNumbersDesc = (a, b) => (a != null ? (b != null ? b - a : -1) : b != null ? 1 : 0)

/**
 * Compare two dates, sorting earlier dates first. The empy values `null` and `undefined` sort last.
 *
 * @param {date|null|undefined} a - first date
 * @param {date|null|undefined} b - second date
 * @returns  {number} - positive (a after b), negative (a before b), zero (original order)
 */
export function compareDatesAsc(a, b) {
  a = !a ? null : DateTime.isDateTime(a) ? a.toMillis() : a.getTime()
  b = !b ? null : DateTime.isDateTime(b) ? b.toMillis() : b.getTime()
  return compareNumbersAsc(a, b)
}

/**
 * Compare two dates, sorting later dates first. The empy values `null` and `undefined` sort last.
 *
 * @param {date|null|undefined} a - first date
 * @param {date|null|undefined} b - second date
 * @returns  {number} - positive (a after b), negative (a before b), zero (original order)
 */
export function compareDatesDesc(a, b) {
  a = !a ? null : DateTime.isDateTime(a) ? a.toMillis() : a.getTime()
  b = !b ? null : DateTime.isDateTime(b) ? b.toMillis() : b.getTime()
  return compareNumbersDesc(a, b)
}

/**
 * Compare two strings with an alphabetic ordering. To sort strings with numbers in a human-friendly way, see
 * `compareStringsNatural`. The empty values  `""`, `null`, and `undefined` sort last.
 *
 * @param {number|null|defined} a - first number
 * @param {number|null|defined} b - second number
 * @returns {number} - positive (a after b), negative (a before b), zero (original order)
 */
export const compareStrings = (a, b) => (a ? (b ? a.localeCompare(b) : -1) : b ? 1 : 0)

/**
 * Compare two strings with a reverse-alphabetic ordering. To sort strings with numbers in a human-friendly way, see
 * `compareStringsNaturalReversed`. The empty values  `""`, `null`, and `undefined` sort last.
 *
 * @param {number|null|defined} a - first number
 * @param {number|null|defined} b - second number
 * @returns {number} - positive (a after b), negative (a before b), zero (original order)
 */
export const compareStringsReversed = (a, b) => (a ? (b ? b.localeCompare(a) : -1) : b ? 1 : 0)

/**
 * Compare two strings with a natural alphabetic ordering (numbers sort properly). Empty values sort last: `""`, `null`,
 * and `undefined` last.
 *
 * @param {number|null|defined} a - first number
 * @param {number|null|defined} b - second number
 * @returns {number} - positive (a after b), negative (a before b), zero (original order)
 */
export const compareStringsNatural = (a, b) => (a ? (b ? naturalCompare(a, b) : -1) : b ? 1 : 0)

/**
 * Compare two strings with a natural reverse-alphabetic ordering (numbers sort properly). Empty values sort last: `""`,
 * `null`, and `undefined` last.
 *
 * @param {number|null|defined} a - first number
 * @param {number|null|defined} b - second number
 * @returns {number} - positive (a after b), negative (a before b), zero (original order)
 */
export const compareStringsNaturalReversed = (a, b) => (a ? (b ? naturalCompare(b, a) : -1) : b ? 1 : 0)
