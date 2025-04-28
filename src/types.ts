/** CSS properties. */
export type CSSProperties = Record<string, null | number | string | undefined>

/** An optional value that may not be present. */
export type Optional<T> = null | T | undefined

/** URL or JSON parameters. */
export type Params = Record<string, boolean | null | number | string | undefined>

/** Primitives. */
export type Primitive = bigint | boolean | null | number | string | symbol | undefined
