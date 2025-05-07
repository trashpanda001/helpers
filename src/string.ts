/**
 * String utilities.
 *
 * @module
 */
import type { CSSProperties, URLParams } from "./types.js"

export type { CSSProperties, URLParams }

const isSSR = typeof window == "undefined"

/**
 * Convert first character in a string to uppercase, leaving the rest untouched.
 *
 * @param string - the string to capitalize
 * @returns the string with the first character capitalized
 *
 * @example
 * ```ts
 * import { capitalize } from "@trashpanda001/helpers/string"
 *
 * capitalize("hello, world.")
 * // "Hello, world."
 * ```
 */
export function capitalize(string: string) {
  return string[0] ? string[0].toUpperCase() + string.slice(1) : ""
}

/**
 * Breaks a string into chunks of size `chunkSize`.
 *
 * The last chunk may contain less than `chunkSize` characters.
 *
 * @param string - the string to chunk
 * @param chunkSize - a positive integer
 * @returns an array of strings
 * @throws RangeError if `chunkSize` is not a positive integer
 *
 * @example
 * ```ts
 * import { chunkEvery } from "@trashpanda001/helpers/string"
 *
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
 *
 * @param count - the number of items
 * @param singular - the singular form of the item
 * @param plural - the plural form of the item (default: `singular + "s"`)
 * @returns the string with the count and the singular or plural form
 *
 * @example
 * ```ts
 * import { countable } from "@trashpanda001/helpers/string"
 *
 * countable(1, "cat")
 * // "1 cat"
 * countable(2, "cat")
 * // "2 cats"
 * countable(2, "cat", "felines")
 * // "2 felines"
 */
export function countable(count: number, singular: string, plural: string = singular + "s") {
  return count == 1 ? `1 ${singular}` : `${count} ${plural}`
}

/**
 * Decode a base-64 string into a binary string.
 *
 * @param data - the base-64 string to decode
 * @returns the decoded binary string
 *
 * @example
 * ```ts
 * import { decode64 } from "@trashpanda001/helpers/string"
 *
 * decode64("YQ")
 * // "a"
 * decode64("YQ==")
 * // "a"
 * ```
 */
export function decode64(data: string) {
  return isSSR ? Buffer.from(data, "base64").toString() : window.atob(data)
}

/**
 * Encodes a string into a base-64 encoded string.
 *
 * @param string - the string to encode
 * @param padding - whether to add padding characters (`=`) to the end of the string (default: `false`)
 * @returns the base-64 encoded string
 *
 * @example
 * ```ts
 * import { encode64 } from "@trashpanda001/helpers/string"
 *
 * encode64("a")
 * // "YQ"
 * encode64("a", true)
 * // "YQ=="
 * ```
 */
export function encode64(string: string, padding = false) {
  const encoded = isSSR ? Buffer.from(string).toString("base64") : window.btoa(string)
  return padding ? encoded : encoded.replace(/=+$/g, "")
}

/**
 * Encodes the given string to be RFC-3986 compliant.
 *
 * This is `encodeURIComponent` plus the percent encoding for `!`, `'`, `(`, `)`, and `*`.
 *
 * @param string - the string to encode
 * @returns the encoded string
 *
 * @example
 * ```ts
 * import { encodeRfc3986 } from "@trashpanda001/helpers/string"
 *
 * encodeRfc3986("interrobang?!")
 * // "interrobang%3F%21"
 * ```
 */
export function encodeRfc3986(string: string) {
  return encodeURIComponent(string).replace(/[!'()*]/g, (c) => "%" + c.charCodeAt(0).toString(16))
}

/**
 * Encode a URL with optional query parameters.
 *
 * Automatically drops null or undefined parameter values (if needed, explicitly pass as string values).
 * Handles the case if the `url` already constains some re-encoded query parameters.
 *
 * @param url - the URL to encode
 * @param params - the query parameters to encode
 * @returns the encoded URL
 *
 * @example
 * ```ts
 * import { encodeUrl } from "@trashpanda001/helpers/string"
 *
 * encodeUrl("/search", { a: null, limit: 200, query: "foo bar", z: undefined })
 * // "/search?limit=200&query=foo+bar"
 * encodeUrl("/search?limit=200", { query: "foo" })
 * // "/search?limit=200&query=foo"
 * encodeUrl("/none", null)
 * // "/none"
 * ```
 */
export function encodeUrl(url: string | URL, params: URLParams = {}) {
  let u: URL
  let isAbsolute: boolean
  if (url instanceof URL) {
    isAbsolute = true
    u = url
  } else {
    isAbsolute = /^https?:\/\//.test(url)
    u = new URL(url, !isAbsolute ? "http://localhost" : undefined)
  }
  Object.entries(params).forEach(([key, value]) => {
    if (value == null) {
      u.searchParams.delete(key)
    } else {
      u.searchParams.set(key, String(value))
    }
  })
  return isAbsolute ? u.href : u.pathname + u.search + u.hash
}

/**
 * Hash a string via DJBX33A (Daniel J. Bernstein, Times 33 with Addition).
 *
 * https://stackoverflow.com/questions/10696223/reason-for-5381-number-in-djb-hash-function/13809282#13809282
 *
 * @param string - string to hash
 * @returns integer (possibly negative)
 *
 * @example
 * ```ts
 * import { hashCode } from "@trashpanda001/helpers/string"
 *
 * hashCode("abc")
 * // 108966
 * ```
 */
export function hashCode(string: string) {
  return string.split("").reduce((a, b) => ((a << 5) + a + b.charCodeAt(0)) | 0, 0)
}

/**
 * Returns the hostname of the given URL or empty string.
 *
 * @param url - the URL to parse
 * @returns the hostname of the URL or empty string
 *
 * @example
 * ```ts
 * import { hostname } from "@trashpanda001/helpers/string"
 *
 * hostname("https://example.com/foo")
 * // "example.com"
 * ```
 */
export function hostname(url: null | string | undefined | URL) {
  if (url == null) {
    return ""
  }
  if (url instanceof URL) {
    return url.hostname
  }
  try {
    return new URL(url).hostname
  } catch {
    return ""
  }
}

/**
 * Convert a CSS object to a CSS string value.
 *
 * Similar to what React does when using a style object in a Component.
 *
 * @param styles - the CSS properties to convert
 * @returns the CSS string value
 *
 * @example
 * ```ts
 * import { styleToString } from "@trashpanda001/helpers/string"
 *
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
 * @param name - the name to unprefix
 * @returns the name without the prefix
 *
 * @example
 * ```ts
 * import { unprefixName } from "@trashpanda001/helpers/string"
 *
 * unprefixName("The Odor")
 * // "Odor"
 * unprefixName("Theodore")
 * // "Theodore"
 * ```
 */
export function unprefixName(name: string) {
  return name.replace(/^(the|a|an) /i, "")
}

/**
 * Decodes a URL-safe base-64 string into a binary string.
 *
 * @param data - the base-64 string to decode
 * @returns the decoded binary string
 *
 * @example
 * ```ts
 * import { urlDecode64 } from "@trashpanda001/helpers/string"
 *
 * urlDecode64("QS9CK0M")
 * // "A/B+C"
 * urlDecode64("QS9CK0M=")
 * // "A/B+C"
 * ```
 */
export function urlDecode64(data: string) {
  return decode64(data.replace(/-/g, "+").replace(/_/g, "/"))
}

/**
 * Encodes a binary string into a base-64 encoded string with a URL and filename safe alphabet.
 *
 * @param string - the string to encode
 * @param padding - whether to add padding characters (`=`) to the end of the string (default: `false`)
 * @returns the base-64 encoded string
 *
 * @example
 * ```ts
 * import { urlEncode64 } from "@trashpanda001/helpers/string"
 *
 * urlEncode64("A/B+C")
 * // "QS9CK0M"
 * urlEncode64("A/B+C", true)
 * // "QS9CK0M="
 * ```
 */
export function urlEncode64(string: string, padding = false) {
  return encode64(string, padding).replace(/\+/g, "-").replace(/\//g, "_")
}
