/**
 * Function utilities.
 *
 * @module
 */

import { randomFloat } from "./number.js"

/**
 * Schedule a callback to trigger between min and max delay.
 *
 * #### Examples
 *
 *     asyncCallback(doCallback)
 *     // invokes in 20-80ms
 *
 *     const cancelFn = asyncCallback(doCallback, 0, 1000)
 *     // invokes in 0-1000ms
 *     cancelFn()
 *     // cancels timer (cleanup)
 *
 * @param callback - function to invoke after delay
 * @param minDelay - minimum delay in milliseconds, defaults to 20
 * @param maxDelay - maximum delay in milliseconds, defaults to minDelay + 80
 * @returns cancel / cleanup function to abort callback
 */
export function asyncCallback(callback: () => void, minDelay = 20, maxDelay = minDelay + 80) {
  const delay = randomFloat(minDelay, maxDelay)
  const timerId = setTimeout(callback, delay)
  return () => clearTimeout(timerId)
}

/**
 * An identity function that returns its first argument.
 *
 * @param value - the value to return
 * @returns the value passed in
 *
 * @example
 * ```ts
 * import { identity } from "@trashpanda001/helpers/function"
 *
 * identity(123)
 * // 123
 * ```
 */
export function identity<T>(value: T) {
  return value
}

/**
 * A noop "no operation" function – ignores inputs and returns void.
 *
 * @param _args - ignored arguments
 *
 * @example
 * ```tsx
 * import { noop } from "@trashpanda001/helpers/function"
 *
 * <button onClick={noop}>Try again</button>
 * ```
 */
export function noop(..._args: unknown[]) {}

/**
 * Sleep this duration.
 *
 * @param ms - milliseconds to sleep
 * @returns a Promise that resolves in `ms` milliseconds
 *
 * @example
 * ```ts
 * import { await } from "@trashpanda001/helpers/function"
 *
 * await sleep(1000)
 * ```
 */
export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
