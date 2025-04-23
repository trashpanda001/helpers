/**
 * Convert first character in a string to uppercase, leaving the rest untouched.
 */
export function capitalize(string: string) {
  return string[0] ? string[0].toUpperCase() + string.slice(1) : ""
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
export const decode64 = (data: string) =>
  typeof window === "undefined" ? Buffer.from(data, "base64").toString() : window.atob(data)

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
  const encoded = typeof window === "undefined" ? Buffer.from(data).toString("base64") : window.btoa(data)
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
export const encodeRfc3986 = (string: string) =>
  encodeURIComponent(string).replace(/[!'()*]/g, (c) => "%" + c.charCodeAt(0).toString(16))

// /**
//  * Encode a URL with optional query parameters. Automatically drops null or undefined parameter values (if needed,
//  * explicitly pass as string values). Handles the case if the `url` already constains some re-encoded query parameters.
//  *
//  * @example
//  * ```ts
//  * encodeUrl("/search", { query: "foo", ignored: null })  // "/search?query=foo"
//  * encodeUrl("/search?limit=200", { query: "foo" })       // "/search?limit=200&query=foo"
//  * encodeUrl("/none", {})                                 // "/none"
//  * ```
//  */
// export function encodeUrl(url: string, params: Record<string, null | string | undefined> = {}) {
//   const entries = Object.entries(params).filter(([_k, v]) => v != null)
//   const encodedParams = new URLSearchParams(entries).toString()
//   if (encodedParams == "") {
//     return url
//   }
//   return url.includes("?") ? `${url}&${encodedParams}` : `${url}?${encodedParams}`
// }

/**
 * DJBX33A (Daniel J. Bernstein, Times 33 with Addition).
 * https://stackoverflow.com/questions/10696223/reason-for-5381-number-in-djb-hash-function/13809282#13809282
 *
 * @example
 * ```ts
 * hashCode("abc")  // 108966
 * ```
 *
 * @param string - string to hash
 * @returns integer (possibly negative)
 */
export const hashCode = (s: string) => s.split("").reduce((a, b) => ((a << 5) + a + b.charCodeAt(0)) | 0, 0)

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

type CSSProperties = Record<string, null | number | string | undefined>

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
export const unprefixName = (name: string) => name.replace(/^(the|a|an) /i, "")

/**
 * Decodes a URL-safe base-64 string into a binary string.
 *
 * @example
 * ```ts
 * urlDecode64("QS9CK0M")   // "A/B+C"
 * urlDecode64("QS9CK0M=")  // "A/B+C"
 * ```
 */
export const urlDecode64 = (data: string) => decode64(data.replace(/-/g, "+").replace(/_/g, "/"))

/**
 * Encodes a binary string into a base-64 encoded string with a URL and filename safe alphabet.
 *
 * @example
 * ```ts
 * urlEncode64("A/B+C")        // "QS9CK0M"
 * urlEncode64("A/B+C", true)  // "QS9CK0M="
 * ```
 */
export const urlEncode64 = (data: string, padding = false) =>
  encode64(data, padding).replace(/\+/g, "-").replace(/\//g, "_")
