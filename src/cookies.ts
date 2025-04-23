const isSSR = typeof window == "undefined"

/** Cookie options and defaults:
 * - domain: set explicitly to apex domain to allow subdomains access (default: no domain set)
 * - maxAge: "session" or number of seconds before expiration (default: 34560000 seconds = 400 days)
 * - path: path to set the cookie on (default: "/")
 * - sameSite: "Strict", Lax", "None", or "" (default: "Lax")
 */
type CookieOptions = {
  domain?: string
  maxAge?: "session" | number
  path?: string
  sameSite?: "" | "Lax" | "None" | "Strict"
}

/** Delete the given cookie.
 *
 * The domain and path options should match what was used to set the cookie. See `nukeCookie` for a way to delete
 * cookies with all permutations of domains, subdomains, paths, and subpaths.
 *
 * @throws Error if called during SSR
 * @example
 * ```ts
 * deleteCookie("foo")
 * // Set-Cookie: foo=; Path=/; Secure; Same-Site=Lax; Max-Age=0
 * deleteCookie("bar", { domain: "example.com" })
 * // Set-Cookie: foo=; Domain=example.com; Path=/; Secure; Same-Site=Lax; Max-Age=0
 * ```
 */
export function deleteCookie(name: string, options?: CookieOptions) {
  if (isSSR) {
    throw new Error("deleteCookie is not available during SSR")
  }
  setCookie(name, "", options)
}

/**
 * Get a cookie by name.
 *
 * Returns a URI decoded value, or an empty string if the cookie does not exist.
 *
 * @throws Error if called during SSR
 * @example
 * ```ts
 * getCookie("foo")      // "bar"
 * getCookie("unknown")  // ""
 * ```
 */
export function getCookie(name: string) {
  if (isSSR) {
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
 * @throws Error if called during SSR
 * @example
 * ```ts
 * getCookies()  // { foo: "bar", baz: "qux" }
 * ```
 */
export function getCookies() {
  if (isSSR) {
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
 * Delete a cookie with all permutations of domains and subdomains of `window.location.hostname` and
 * all subpaths of the given path (defaults to `window.location.pathname`).
 *
 * @throws Error if called during SSR
 * @example
 * ```ts
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
  if (isSSR) {
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
 * @throws Error if called during SSR
 * @example
 * ```ts
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
export function setCookie(name: string, value: string, options: CookieOptions = {}) {
  if (isSSR) {
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
