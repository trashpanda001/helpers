/**
 * Convert first character in a string to uppercase, leaving the rest untouched.
 */
export function capitalize(string: string) {
  return string[0] ? string[0].toUpperCase() + string.slice(1) : ""
}

/**
 * Pluralize / count something (in English).
 *
 * @param {number} count - number of things
 * @param {string} singular - singular word/phrase
 * @param {string} plural - plural word/phrase
 * @returns
 */
export const countable = (count, singular, plural) => (count == 1 ? `1 ${singular}` : `${count} ${plural}`)

/**
 * Decode a base-64 string into a binary string.
 *
 * @example
 * decode64("YQ")
 * // "a"
 * decode64("YQ==")
 * // "a"
 *
 * @param {string} data - base-64 string to decode
 * @returns {string} decoded binary data
 */
export const decode64 = (data) =>
  typeof window === "undefined" ? Buffer.from(data, "base64").toString() : window.atob(data)

/**
 * Encodes a string into a base-64 encoded string. No padding by default.
 *
 * @example
 * encode64("a")
 * // "YQ"
 * encode64("a", true)
 * // "YQ=="
 *
 * @param {string} data - binary string to encode
 * @param {boolean} padding - include padding, defaults to false
 * @returns {string} base-64 encoded string
 */
export function encode64(data, padding = false) {
  const encoded = typeof window === "undefined" ? Buffer.from(data).toString("base64") : window.btoa(data)
  return padding ? encoded : encoded.replace(/=+$/g, "")
}

/**
 * Encodes the given string to be RFC-3986 compliant. This is `encodeURIComponent` plus the percent
 * encoding for `!`, `'`, `(`, `)`, and `*`.
 *
 * @example
 * encodeRfc3986("interrobang?!")
 * // "interrobang%3F%21"
 *
 * @param {string} string - unencoded string
 * @returns {string} RFC-3986 encoded string
 */
export const encodeRfc3986 = (string) =>
  encodeURIComponent(string).replace(/[!'()*]/g, (c) => "%" + c.charCodeAt(0).toString(16))

/**
 * Encode a URL with optional query parameters. Automatically drops null or undefined parameter values (if needed,
 * explicitly pass as string values). Handles the case if the `url` already constains some re-encoded query parameters.
 *
 * @example
 * encodeUrl("/search", { query: "foo", ignored: null })
 * // "/search?query=foo"
 * encodeUrl("/search?limit=200", { query: "foo" })
 * // "/search?limit=200&query=foo"
 * encodeUrl("/none", {})
 * // "/none"
 *
 * @param {string} url - base URL
 * @param {Object} params - key/value parameters to be URL-encoded
 * @returns {string} URL string with properly encoded with parameters
 */
export function encodeUrl(url, params = {}) {
  const entries = Object.entries(params).filter(([_k, v]) => v != null)
  const encodedParams = new URLSearchParams(entries).toString()
  if (encodedParams == "") {
    return url
  }
  return url.includes("?") ? `${url}&${encodedParams}` : `${url}?${encodedParams}`
}

/**
 * DJBX33A (Daniel J. Bernstein, Times 33 with Addition).
 * https://stackoverflow.com/questions/10696223/reason-for-5381-number-in-djb-hash-function/13809282#13809282
 *
 * @example
 * hashCode("abc")
 * // 108966
 *
 * @param {string} string - string to hash
 * @returns {number} integer (possibly negative)
 */
export const hashCode = (string) => string.split("").reduce((a, b) => ((a << 5) + a + b.charCodeAt(0)) | 0, 0)

/**
 * Returns the hostname of the given URL or empty string.
 *
 * @example
 * hostname("https://example.com/foo")
 * // "example.com"
 *
 * @param {string} url - url string
 * @returns {string} hostname or empty string
 */
export const hostname = (url) => {
  try {
    return url ? new URL(url).hostname : ""
  } catch {
    return ""
  }
}

/**
 * Convert a CSS object to a CSS value. Similar to what React does when using a style object in a Component.
 *
 * @example
 * styleToString({ backgroundColor: "#000", position: "absolute" })
 * // "background-color:#000;position:absolute"
 *
 * @param {Object} object - style object
 * @returns {string} style string
 */
export const styleToString = (object) =>
  Object.entries(object)
    .map(([k, v]) => {
      const kebab = k.replace(/[A-Z]/g, (match) => `-${match.toLowerCase()}`)
      return `${kebab}:${v}`
    })
    .join(";")

/**
 * Removes common stop word determiners from the beginning of a name: the, a, an.
 *
 * This is typically done for a more natural sort order, for example "The Beatles" would be changed
 * to "Beatles" and sorted with other bands beginning with the letter B.
 *
 * @example
 * unprefixName("The Odor") // "Odor"
 * unprefixName("Theodore") // "Theodore"
 *
 * @param {string} name - a proper name
 * @returns {string} the unprefixed name (or original)
 */
export const unprefixName = (name) => name.replace(/^(the|a|an) /i, "")

/**
 * Decodes a URL-safe base-64 string into a binary string.
 *
 * @example
 * urlDecode64("QS9CK0M")
 * // "A/B+C"
 * urlDecode64("QS9CK0M=")
 * // "A/B+C"
 *
 * @param {string} data - URL-safe base-64 string to decode
 * @returns {string} decoded binary data
 */
export const urlDecode64 = (data) => decode64(data.replace(/-/g, "+").replace(/_/g, "/"))

/**
 * Encodes a binary string into a base-64 encoded string with a URL and filename safe alphabet.
 *
 * @example
 * urlEncode64("A/B+C")
 * // "QS9CK0M"
 * urlEncode64("A/B+C", true)
 * // "QS9CK0M="
 *
 * @param {string} data - binary string to encode
 * @param {boolean} padding - include padding, defaults to false
 * @returns {string} URL-safe base-64 encoded string
 */
export const urlEncode64 = (data, padding) => encode64(data, padding).replace(/\+/g, "-").replace(/\//g, "_")
