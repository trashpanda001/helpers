/**
 * Common types.
 *
 * @module
 */
/** CSS properties. */
export type CSSProperties = Record<string, null | number | string | undefined>

/** An optional value that may not be present. */
export type Optional<T> = null | T | undefined

/** Primitives. */
export type Primitive = bigint | boolean | null | number | string | symbol | undefined

/** Simple URL key-value parameters. */
export type URLParams = Record<string, boolean | null | number | string | undefined>
