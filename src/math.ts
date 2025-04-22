/**
 * Clamp a number between a min and max value.
 *
 * @param {number} number - number to clamp
 * @param {number} min - minimum value
 * @param {number} max - maximum value
 * @returns
 */
export const clamp = (number, min, max) => Math.min(Math.max(number, min), max)

/**
 * Calculate the Euclidean distance between two points with cartesian coordinates.
 *
 * @example
 * distance(1, 2, 3, 4)
 * // 5
 *
 * @param {number} x1 - x coordinate of first point
 * @param {number} y1 - y coordinate of first point
 * @param {number} x2 - x coordinate of second point
 * @param {number} y2 - y coordinate of second point
 * @returns {number} Euclidean distance between the two points
 */
export const distance = (x1, y1, x2, y2) => Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2)

/**
 * Computes the modulo remainder of a division. The result will always have the sign of the divisor.
 * This differs from the `%` operator in JavaScript, which is really the remainder operator.
 *
 * @example
 * mod(5, 2)
 * // 1
 * mod(-5, 2)  // note -5 % 2 is negative = -1
 * // 1
 *
 * @param {number} dividend - the dividend
 * @param {number} divisor - the divisor
 * @returns {number} integer with the sign of the divisor
 */
export const mod = (dividend, divisor) => {
  const remainder = dividend % divisor
  return remainder * divisor < 0 ? remainder + divisor : remainder
}

/**
 * Quantize a number to a given step interval.
 *
 * @example
 * quantize(31, 5)
 * // 30
 *
 * @param {number} value - value to quantize
 * @param {number} step - step interval
 * @returns {number} quantized value
 */
export const quantize = (value, step) => Math.round(value / step) * step

/**
 * Generate a random float between `min` (inclusive) and `max` (exclusive). If `max` is omitted,
 * generates a random float between `0-min`.
 *
 * @example
 * randomFloat(0, 99.99) // or randomFloat(99.99)
 * // 42.1
 *
 * @param {number} min - min value (non-negative, inclusive)
 * @param {number|undefined} max - max value (positive, exclusive), if undefined `0-min`
 * @returns {number} a random integer from `min` to `max-1`
 */
export const randomFloat = (min, max) => (max === undefined ? randomFloat(0, min) : min + Math.random() * (max - min))

/**
 * Generate a random integer between `min` (inclusive) and `max` (exclusive). If `max` is omitted,
 * generates a random integer between `0-min`.
 *
 * @example
 * randomInt(100) // or randomInt(0, 100)
 * // 42
 *
 * @param {number} min - min value (non-negative, inclusive)
 * @param {number|undefined} max - max value (positive, exclusive)
 * @returns {number} a random integer from `min` to `max-1`
 */
export const randomInt = (min, max) => Math.floor(randomFloat(min, max))
