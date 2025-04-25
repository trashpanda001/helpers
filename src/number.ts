/**
 * Clamp a number between a min and max value.
 *
 * @example
 * ```ts
 * clamp(5, 0, 10)   // 5
 * clamp(-5, 0, 10)  // 0
 * clamp(15, 0, 10)  // 10
 * ```
 */
export const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max)

/**
 * Calculate the Euclidean distance between two points with cartesian coordinates.
 *
 * @example
 * ```ts
 * distance(1, 2, 3, 4)   // 2.8284271247461903
 * distance (0, 0, 3, 4)  // 5
 * ```
 */
export const distance = (x1: number, y1: number, x2: number, y2: number) => Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2)

/**
 * Computes the modulo remainder of a division. The result will always have the sign of the divisor.
 * This differs from the `%` operator in JavaScript, which is really the remainder operator.
 *
 * @throws RangeError if divisor is zero
 * @example
 * ```ts
 * mod(5, 2)   // 1
 * mod(-5, 2)  // 1 (where as -5 % 2 is -1)
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
 * @throws RangeError if step is not positive
 * @example
 * ```ts
 * quantize(31, 5)  // 30
 * quantize(31, 2)  // 32
 * ```
 */
export function quantize(value: number, step: number) {
  if (step <= 0) {
    throw new RangeError("step must be positive")
  }
  return Math.round(value / step) * step
}

/**
 * Generate a random float between `min` (inclusive) and `max` (exclusive). If `max` is omitted,
 * generates a random float between `0-min`.
 *
 * @example
 * ```ts
 * randomFloat(100)    // [0, 100)
 * randomFloat(5, 10)  // [5, 10)
 * ```
 */
export function randomFloat(min: number, max?: number) {
  return max === undefined ? Math.random() * min : min + Math.random() * (max - min)
}

/**
 * Generate a random integer between `min` (inclusive) and `max` (exclusive). If `max` is omitted,
 * generates a random integer between `0-min`.
 *
 * @example
 * ```ts
 * randomInt(100)     // [0, 100)
 * randomInt(10, 20)  // [10, 20)]
 * ```
 */
export function randomInt(min: number, max?: number) {
  return Math.floor(randomFloat(min, max))
}
