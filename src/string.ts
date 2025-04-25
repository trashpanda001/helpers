const isSSR = typeof window == "undefined"

/**
 * Convert first character in a string to uppercase, leaving the rest untouched.
 */
export function capitalize(string: string) {
  return string[0] ? string[0].toUpperCase() + string.slice(1) : ""
}

/**
 * Breaks a string into chunks of size `chunkSize`. The last chunk may contain less than `chunkSize` characters.
 *
 * @example
 * ```ts
 * chunkEvery("Hello", 2)
 * // ["He, "ll", "o"]
 * ```
 */
export function chunkEvery(string: string, chunkSize: number) {
  if (!(Number.isInteger(chunkSize) && chunkSize > 0)) {
    throw new RangeError("Chunk size must be a positive integer")
  }
  const result = []
  for (let i = 0; i < string.length; i += chunkSize) {
    result.push(string.slice(i, i + chunkSize))
  }
  return result
}

/**
 * Pluralize / count something in English.
 */
export function countable(count: number, singular: string, plural: string = singular + "s") {
  return count == 1 ? `1 ${singular}` : `${count} ${plural}`
}

/**
 * Decode a base-64 string into a binary string.
 *
 * @example
 * ```ts
 * decode64("YQ")    // "a"
 * decode64("YQ==")  // "a"
 * ```
 */
export function decode64(data: string) {
  return isSSR ? Buffer.from(data, "base64").toString() : window.atob(data)
}

/**
 * Encodes a string into a base-64 encoded string. No padding by default.
 *
 * @example
 * ```ts
 * encode64("a")        // "YQ"
 * encode64("a", true)  // "YQ=="
 * ```
 */
export function encode64(data: string, padding = false) {
  const encoded = isSSR ? Buffer.from(data).toString("base64") : window.btoa(data)
  return padding ? encoded : encoded.replace(/=+$/g, "")
}

/**
 * Encodes the given string to be RFC-3986 compliant. This is `encodeURIComponent` plus the percent
 * encoding for `!`, `'`, `(`, `)`, and `*`.
 *
 * @example
 * ```ts
 * encodeRfc3986("interrobang?!")  // "interrobang%3F%21"
 * ```
 */
export function encodeRfc3986(string: string) {
  return encodeURIComponent(string).replace(/[!'()*]/g, (c) => "%" + c.charCodeAt(0).toString(16))
}

/**
 * Encode a URL with optional query parameters. Automatically drops null or undefined parameter values (if needed,
 * explicitly pass as string values). Handles the case if the `url` already constains some re-encoded query parameters.
 *
 * @example
 * ```ts
 * encodeUrl("/search", { a: null, limit: 200, query: "foo bar", z: undefined })  // "/search?limit=200&query=foo+bar"
 * encodeUrl("/search?limit=200", { query: "foo" })                               // "/search?limit=200&query=foo"
 * encodeUrl("/none", null)                                                       // "/none"
 * ```
 */
export function encodeUrl(url: string, params: null | Record<string, null | number | string | undefined> | undefined) {
  const isAbsolute = /^https?:\/\//.test(url)
  const u = new URL(url, !isAbsolute ? "http://localhost" : undefined)
  Object.entries(params || {}).forEach(([key, value]) => {
    if (value != null) {
      u.searchParams.set(key, String(value))
    } else {
      u.searchParams.delete(key)
    }
  })
  return isAbsolute ? u.href : u.pathname + u.search + u.hash
}

/**
 * DJBX33A (Daniel J. Bernstein, Times 33 with Addition).
 * https://stackoverflow.com/questions/10696223/reason-for-5381-number-in-djb-hash-function/13809282#13809282
 *
 * @example
 * ```ts
 * hashCode("abc")  // 108966
 * ```
 *
 * @param s - string to hash
 * @returns integer (possibly negative)
 */
export function hashCode(s: string) {
  return s.split("").reduce((a, b) => ((a << 5) + a + b.charCodeAt(0)) | 0, 0)
}

/**
 * Returns the hostname of the given URL or empty string.
 *
 * @example
 * ```ts
 * hostname("https://example.com/foo")  // "example.com"
 * ```
 */
export const hostname = (url: string) => {
  try {
    return url ? new URL(url).hostname : ""
  } catch {
    return ""
  }
}

export type CSSProperties = Record<string, null | number | string | undefined>

/**
 * Convert a CSS object to a CSS value. Similar to what React does when using a style object in a Component.
 *
 * @example
 * ```ts
 * styleToString({ backgroundColor: "#000", position: "absolute" })
 * // "background-color:#000;position:absolute"
 * ```
 */
export function styleToString(styles: CSSProperties) {
  return Object.entries(styles)
    .filter(([, v]) => v != null)
    .map(([k, v]) => {
      const kebab = k.replace(/[A-Z]/g, (match) => `-${match.toLowerCase()}`)
      return `${kebab}:${v}`
    })
    .join(";")
}

/**
 * Removes common stop word determiners from the beginning of a name: the, a, an.
 *
 * This is typically done for a more natural sort order, for example "The Beatles" would be changed
 * to "Beatles" and sorted with other bands beginning with the letter B.
 *
 * @example
 * ```ts
 * unprefixName("The Odor") // "Odor"
 * unprefixName("Theodore") // "Theodore"
 * ```
 */
export function unprefixName(name: string) {
  return name.replace(/^(the|a|an) /i, "")
}

/**
 * Decodes a URL-safe base-64 string into a binary string.
 *
 * @example
 * ```ts
 * urlDecode64("QS9CK0M")   // "A/B+C"
 * urlDecode64("QS9CK0M=")  // "A/B+C"
 * ```
 */
export function urlDecode64(data: string) {
  return decode64(data.replace(/-/g, "+").replace(/_/g, "/"))
}

/**
 * Encodes a binary string into a base-64 encoded string with a URL and filename safe alphabet.
 *
 * @example
 * ```ts
 * urlEncode64("A/B+C")        // "QS9CK0M"
 * urlEncode64("A/B+C", true)  // "QS9CK0M="
 * ```
 */
export function urlEncode64(data: string, padding = false) {
  return encode64(data, padding).replace(/\+/g, "-").replace(/\//g, "_")
}
