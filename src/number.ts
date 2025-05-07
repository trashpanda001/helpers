/**
 * Number utilities.
 *
 * @module
 */

/**
 * Clamp a number between a min and max value.
 *
 * @param value - the number to clamp
 * @param min - the minimum value
 * @param max - the maximum value
 * @returns the clamped value
 *
 * @example
 * ```ts
 * import { clamp } from "@trashpanda001/helpers/number"
 *
 * clamp(5, 0, 10)
 * // 5
 * clamp(-5, 0, 10)
 * // 0
 * clamp(15, 0, 10)
 * // 10
 * ```
 */
export function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}

/**
 * Calculate the Euclidean distance between two points with cartesian coordinates.
 *
 * @param x1 - the x coordinate of the first point
 * @param y1 - the y coordinate of the first point
 * @param x2 - the x coordinate of the second point
 * @param y2 - the y coordinate of the second point
 * @returns the distance between the two points
 *
 * @example
 * ```ts
 * import { distance } from "@trashpanda001/helpers/number"
 *
 * distance(1, 2, 3, 4)
 * // 2.8284271247461903
 * distance (0, 0, 3, 4)
 * // 5
 * ```
 */
export function distance(x1: number, y1: number, x2: number, y2: number) {
  return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2)
}

/**
 * Computes the modulo remainder of a division.
 *
 * The result will always have the sign of the divisor. This differs from the `%` operator in JavaScript,
 * which is really the remainder operator.
 *
 * @param dividend - the number to be divided
 * @param divisor - the number to divide by
 * @returns the modulo remainder with the sign of the divisor
 * @throws RangeError if divisor is zero
 *
 * @example
 * ```ts
 * import { mod } from "@trashpanda001/helpers/number"
 *
 * mod(5, 2)
 * // 1
 * mod(-5, 2)
 * // 1 .. where as -5 % 2 is -1
 * ```
 */
export function mod(dividend: number, divisor: number) {
  if (divisor == 0) {
    throw new RangeError("divisor cannot be zero")
  }
  const remainder = dividend % divisor
  return remainder * divisor < 0 ? remainder + divisor : remainder
}

/**
 * Quantize a number to a given step interval.
 *
 * @param value - the number to quantize
 * @param step - the positive step interval
 * @returns the quantized value
 * @throws RangeError if step is not positive
 *
 * @example
 * ```ts
 * import { quantize } from "@trashpanda001/helpers/number"
 *
 * quantize(31, 5)
 * // 30
 * quantize(31, 2)
 * // 32
 * ```
 */
export function quantize(value: number, step: number) {
  if (step <= 0) {
    // TODO: should step be an integer?
    throw new RangeError("step must be positive")
  }
  return Math.round(value / step) * step
}

/**
 * Generate a random float between `min` (inclusive) and `max` (exclusive). If `max` is omitted,
 * generates a random float between `0-min`.
 *
 * @param min - the minimum value
 * @param max - the maximum value (exclusive)
 * @returns a random float between `min` and `max`
 *
 * @example
 * ```ts
 * import { randomFloat } from "@trashpanda001/helpers/number"
 *
 * randomFloat(100)
 * // 59.9056391729085 .... [0, 100)
 * randomFloat(5, 10)
 * // 7.4373648706011615 .. [5, 10)
 * ```
 */
export function randomFloat(min: number, max?: number) {
  return max === undefined ? Math.random() * min : min + Math.random() * (max - min)
}

/**
 * Generate a random integer between `min` (inclusive) and `max` (exclusive). If `max` is omitted,
 * generates a random integer between `0-min`.
 *
 * @param min - the minimum value
 * @param max - the maximum value (exclusive)
 * @returns a random integer between `min` and `max`
 *
 * @example
 * ```ts
 * import { randomInt } from "@trashpanda001/helpers/number"
 *
 * randomInt(100)
 * // 59 .. [0, 100)
 * randomInt(5, 10)
 * // 7 ... [5, 10)]
 * ```
 */
export function randomInt(min: number, max?: number) {
  return Math.floor(randomFloat(min, max))
}
