/**
 * An identity function that returns its first argument.
 *
 * @example
 * ```ts
 * identity(123) // 123
 * ```
 */
export const identity = <T>(value: T) => value

/**
 * A noop "no operation" function – ignores inputs and returns void.
 *
 * @example
 * ```tsx
 * <button onClick={noop}>Try again</button>
 * ```
 */
export const noop = (..._args: unknown[]): void => {}

/**
 * Sleep this duration.
 *
 * @param ms - milliseconds to sleep
 * @returns a Promise that resolves in `ms` milliseconds
 *
 * @example
 * ```ts
 * await sleep(1000)
 * ```
 */
export const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))
