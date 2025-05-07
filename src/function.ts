/**
 * Function utilities.
 *
 * @module
 */

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
