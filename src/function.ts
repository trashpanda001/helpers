/**
 * An identity function that returns its first argument.
 *
 * @example
 * identity(123) // 123
 *
 * @param {*} value - input
 * @returns input value
 */
export const identity = (value) => value

/**
 * A noop "no operation" function -- it ignores its inputs and always returns undefined.
 *
 * @example
 * <button onClick={noop}>Try again</button>
 *
 * @returns undefined
 */
export const noop = () => undefined

/**
 * Sleep this duration.
 *
 * @example
 * await sleep(1000)
 *
 * @param {number} ms - milliseconds to sleep
 * @returns {Promise} a Promise that resolves in `ms` milliseconds
 */
export const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))
