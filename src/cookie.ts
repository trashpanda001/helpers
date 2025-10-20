/**
 * Cookie utilities.
 *
 * @module
 */
import { isServer } from "./index.js"

/** Cookie options */
export type CookieOptions = {
  /** Explicitly set to apex domain to allow subdomains access (default: no domain set) */
  domain?: string
  /** Max age in seconds or a session cookie (default: 34560000 seconds = 400 days) */
  maxAge?: "session" | number
  /** Path (default: "/") */
  path?: string
  /** Same site policy (default: "Lax") */
  sameSite?: "" | "Lax" | "None" | "Strict"
}

/** Delete the given cookie.
 *
 * The domain and path options should match what was used to set the cookie. See `nukeCookie` for a way to delete
 * cookies with all permutations of domains, subdomains, paths, and subpaths.
 *
 * @param name - the cookie name
 * @param options - cookie options
 * @throws Error if called during SSR
 *
 * @example
 * ```ts
 * import { deleteCookie } from "@trashpanda001/helpers/cookie"
 *
 * deleteCookie("foo")
 * // Set-Cookie: foo=; Path=/; Secure; Same-Site=Lax; Max-Age=0
 * deleteCookie("bar", { domain: "example.com" })
 * // Set-Cookie: foo=; Domain=example.com; Path=/; Secure; Same-Site=Lax; Max-Age=0
 * ```
 */
export function deleteCookie(name: string, options?: Readonly<CookieOptions>) {
  if (isServer) {
    throw new Error("deleteCookie is not available during SSR")
  }
  setCookie(name, "", options)
}

/**
 * Get a cookie by name.
 *
 * Returns a URI decoded value, or an empty string if the cookie does not exist.
 *
 * @param name - the cookie name
 * @returns the cookie value or an empty string if not found
 * @throws Error if called during SSR
 *
 * @example
 * ```ts
 * import { getCookie } from "@trashpanda001/helpers/cookie"
 *
 * getCookie("foo")      // "bar"
 * getCookie("unknown")  // ""
 * ```
 */
export function getCookie(name: string) {
  if (isServer) {
    throw new Error("getCookie is not available during SSR")
  }
  const regex = new RegExp("(?:^|;\\s*)" + name + "=([^;]*)")
  const match = document.cookie.match(regex)
  return match ? decodeURIComponent(match[1]!) : ""
}

/**
 * Get all cookies.
 *
 * Returns an object mapping cookie names to URI decoded values. Assumes all cookie names are unique.
 *
 * @returns an object mapping cookie names to values
 * @throws Error if called during SSR
 *
 * @example
 * ```ts
 * import { getCookies } from "@trashpanda001/helpers/cookie"
 *
 * getCookies()  // { foo: "bar", baz: "qux" }
 * ```
 */
export function getCookies() {
  if (isServer) {
    throw new Error("getCookies is not available during SSR")
  }
  return document.cookie.split("; ").reduce((cookies: Record<string, string>, cookie) => {
    if (cookie) {
      const [name, value] = cookie.split("=")
      cookies[name!] = decodeURIComponent(value!)
    }
    return cookies
  }, {})
}

/**
 * Check if a cookie exists.
 *
 * @param name - the cookie name
 * @returns true if the cookie exists, false otherwise
 * @throws Error if called during SSR
 *
 * @example
 * ```ts
 * import { hasCookie } from "@trashpanda001/helpers/cookie"
 *
 * hasCookie("foo")  // true
 * ```
 */
export function hasCookie(name: string) {
  if (isServer) {
    throw new Error("hasCookie is not available during SSR")
  }
  return document.cookie.split("; ").some((c) => c.startsWith(`${name}=`))
}

/**
 * Delete a cookie with all permutations of domains and subdomains of `window.location.hostname` and
 * all subpaths of the given path.
 *
 * @param name - the cookie name
 * @param path - the path to delete the cookie from (default: `window.location.pathname`)
 * @throws Error if called during SSR
 *
 * @example
 * ```ts
 * import { nukeCookie } from "@trashpanda001/helpers/cookie"
 *
 * nukeCookie("orbit")  // on `https://example.com/xy`
 * // Set-Cookie: orbit=; Domain=example.com; Secure; Max-Age=0
 * // Set-Cookie: orbit=; Domain=example.com; Path=/; Secure; Max-Age=0
 * // Set-Cookie: orbit=; Domain=example.com; Path=/x; Secure; Max-Age=0
 * // Set-Cookie: orbit=; Domain=example.com; Path=/xy; Secure; Max-Age=0
 * // Set-Cookie: orbit=; Domain=com; Secure; Max-Age=0
 * // Set-Cookie: orbit=; Domain=com; Path=/; Secure; Max-Age=0
 * // Set-Cookie: orbit=; Domain=com; Path=/x; Secure; Max-Age=0
 * // Set-Cookie: orbit=; Domain=com; Path=/xy; Secure; Max-Age=0
 * // Set-Cookie: orbit=; Secure; Max-Age=0
 * // Set-Cookie: orbit=; Path=/; Secure; Max-Age=0
 * // Set-Cookie: orbit=; Path=/x; Secure; Max-Age=0
 * // Set-Cookie: orbit=; Path=/xy; Secure; Max-Age=0
 * ```
 * It's the only way to be sure.
 */
export function nukeCookie(name: string, path?: string) {
  if (isServer) {
    throw new Error("nukeCookie is not available during SSR")
  }
  const domainParts = window.location.hostname.split(".")
  const domains = domainParts.map((_, i) => domainParts.slice(i).join(".")).concat([""])
  const pathname = path ?? window.location.pathname
  const paths = Array.from({ length: pathname.length + 1 }).map((_, i) => pathname.substring(0, i))
  domains.forEach((domain) => {
    paths.forEach((path) => {
      setCookie(name, "", { domain, maxAge: 0, path, sameSite: "" })
    })
  })
}

/**
 * Set a cookie to the given value.
 *
 * Assumes the cookie name is a valid cookie token and URI encodes the value. If the value is an empty string, the
 * cookie is deleted. The cookie is not HTTP-only, so it can be accessed from JavaScript.
 *
 * @param name - the cookie name
 * @param value - the cookie value
 * @param options - cookie options
 * @throws Error if called during SSR
 *
 * @example
 * ```ts
 * import { setCookie } from "@trashpanda001/helpers/cookie"
 *
 * setCookie("foo", "bar")
 * // Set-Cookie: foo=bar; Path=/; Secure; Same-Site=Lax; Max-Age=34560000
 * setCookie("foo", "bar", { maxAge: 3600 })
 * // Set-Cookie: foo=bar; Path=/; Secure; Same-Site=Lax; Max-Age=3600
 * setCookie("foo", "bar", { maxAge: "session" })
 * // Set-Cookie: foo=bar; Path=/; Secure; Same-Site=Lax
 * setCookie("foo", "bar", { domain: "example.com" })
 * // Set-Cookie: foo=bar; Domain=example.com; Path=/; Secure; Same-Site=Lax; Max-Age=34560000
 * ```
 */
export function setCookie(name: string, value: string, options: Readonly<CookieOptions> = {}) {
  if (isServer) {
    throw new Error("setCookie is not available during SSR")
  }
  const { domain, maxAge = value != "" ? 34560000 : 0, path = "/", sameSite = "Lax" } = options

  const cookie = [
    `${name}=${encodeURIComponent(value)}`,
    domain ? `; Domain=${domain}` : "",
    path ? `; Path=${path}` : "",
    window.location.protocol == "https:" ? "; Secure" : "",
    sameSite ? `; SameSite=${sameSite}` : "",
    maxAge != "session" ? `; Max-Age=${maxAge}` : "",
  ].join("")
  document.cookie = cookie
}
