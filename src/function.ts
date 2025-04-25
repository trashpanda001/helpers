/**
 * An identity function that returns its first argument.
 *
 * @example
 * ```ts
 * identity(123) // 123
 * ```
 */
export function identity<T>(value: T) {
  return value
}

/**
 * A noop "no operation" function – ignores inputs and returns void.
 *
 * @example
 * ```tsx
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
 * await sleep(1000)
 * ```
 */
export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
