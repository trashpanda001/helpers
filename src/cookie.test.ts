import { getCookie, getCookies, hasCookie, nukeCookie, setCookie } from "@trashpanda001/helpers/cookie"
import { beforeEach, describe, expect, it, vi } from "vitest"

function removeAllCookies() {
  document.cookie.split("; ").forEach((cookie) => {
    const [name] = cookie.split("=")
    document.cookie = `${name}=; Max-Age=-1` // happy-dom doesn't expire with Max-Age=0
  })
}

describe("getCookie", () => {
  beforeEach(removeAllCookies)

  it("returns the value of an existing cookie", () => {
    document.cookie = "testCookie=testValue"
    expect(getCookie("testCookie")).toBe("testValue")
  })

  it("returns an empty string for a non-existing cookie", () => {
    expect(getCookie("nonExistingCookie")).toBe("")
  })

  it("decodes URI-encoded cookie values", () => {
    document.cookie = "symbolsCookie=%21%40%23%24%25"
    expect(getCookie("symbolsCookie")).toBe("!@#$%")
  })

  it("retrieves the correct cookie when multiple cookies are set", () => {
    document.cookie = "firstCookie=value1"
    document.cookie = "secondCookie=value2"
    document.cookie = "thirdCookie=value3"
    expect(getCookie("firstCookie")).toBe("value1")
    expect(getCookie("firstCookie")).toBe("value1")
    expect(getCookie("thirdCookie")).toBe("value3")
  })

  it("handles cookies with special characters in values", () => {
    document.cookie = "specialCookie=value with spaces"
    document.cookie = "jsonCookie=%7B%22key%22%3A%22value%22%7D"
    document.cookie = "symbolsCookie=%21%40%23%24%25"
    expect(getCookie("specialCookie")).toBe("value with spaces")
    expect(getCookie("jsonCookie")).toBe('{"key":"value"}')
    expect(getCookie("symbolsCookie")).toBe("!@#$%")
  })

  it("handles cookies with same name prefix", () => {
    document.cookie = "user=john"
    document.cookie = "username=johndoe"
    document.cookie = "user_id=12345"
    expect(getCookie("user")).toBe("john")
    expect(getCookie("username")).toBe("johndoe")
    expect(getCookie("user_id")).toBe("12345")
  })
})

describe("getCookies", () => {
  beforeEach(removeAllCookies)

  it("returns an empty object in there are no cookies", () => {
    expect(getCookies()).toEqual({})
  })

  it("returns all cookies as a key-value object", () => {
    document.cookie = "firstCookie=value1"
    document.cookie = "secondCookie=value2"
    document.cookie = "thirdCookie=value3"

    expect(getCookies()).toEqual({
      firstCookie: "value1",
      secondCookie: "value2",
      thirdCookie: "value3",
    })
  })

  it("decodes URI-encoded cookie values", () => {
    document.cookie = "specialCookie=value%20with%20spaces"
    document.cookie = "jsonCookie=%7B%22key%22%3A%22value%22%7D"
    document.cookie = "symbolsCookie=%21%40%23%24%25"

    expect(getCookies()).toEqual({
      jsonCookie: '{"key":"value"}',
      specialCookie: "value with spaces",
      symbolsCookie: "!@#$%",
    })
  })
})

describe("hasCookie", () => {
  beforeEach(removeAllCookies)

  it("returns false when no cookies exist", () => {
    expect(getCookies()).toEqual({}) // Verify no cookies
    expect(hasCookie("nonExistent")).toBe(false)
  })

  it("returns true when the cookie exists", () => {
    document.cookie = "testCookie=testValue"
    expect(hasCookie("testCookie")).toBe(true)
  })

  it("returns false when the cookie does not exist", () => {
    document.cookie = "otherCookie=value"
    expect(hasCookie("testCookie")).toBe(false)
  })

  it("returns true for each cookie when multiple cookies exist", () => {
    document.cookie = "firstCookie=value1"
    document.cookie = "secondCookie=value2"
    document.cookie = "thirdCookie=value3"
    expect(hasCookie("firstCookie")).toBe(true)
    expect(hasCookie("secondCookie")).toBe(true)
    expect(hasCookie("thirdCookie")).toBe(true)
    expect(hasCookie("nonExistent")).toBe(false)
  })

  it("handles cookies with similar names correctly", () => {
    document.cookie = "user=john"
    document.cookie = "username=johndoe"
    document.cookie = "user_id=12345"
    expect(hasCookie("user")).toBe(true)
    expect(hasCookie("username")).toBe(true)
    expect(hasCookie("user_id")).toBe(true)
    expect(hasCookie("usern")).toBe(false)
    expect(hasCookie("name")).toBe(false)
  })

  it("returns true for cookie with empty value", () => {
    document.cookie = "emptyCookie="
    expect(hasCookie("emptyCookie")).toBe(true)
  })

  it("returns false after cookie is removed", () => {
    document.cookie = "tempCookie=value"
    expect(hasCookie("tempCookie")).toBe(true)
    document.cookie = "tempCookie=; Max-Age=-1"
    expect(hasCookie("tempCookie")).toBe(false)
  })
})

describe("setCookie", () => {
  it("uses defaults", () => {
    const setter = vi.spyOn(document, "cookie", "set")
    setCookie("foo", "bar")
    expect(setter).toHaveBeenCalledWith("foo=bar; Path=/; SameSite=Lax; Max-Age=34560000")
  })

  it("deletes the cookie with an empty value", () => {
    const setter = vi.spyOn(document, "cookie", "set")
    setCookie("foo", "")
    expect(setter).toHaveBeenCalledWith("foo=; Path=/; SameSite=Lax; Max-Age=0")
  })

  it("URI-encodes the cookie value", () => {
    const setter = vi.spyOn(document, "cookie", "set")
    setCookie("special", "a value with spaces & symbols!")
    expect(setter).toHaveBeenCalledWith(expect.stringContaining("special=a%20value%20with%20spaces%20%26%20symbols!"))
  })

  it("handles setting an explicit domain", () => {
    const setter = vi.spyOn(document, "cookie", "set")
    setCookie("foo", "bar", { domain: "example.com" })
    expect(setter).toHaveBeenCalledWith(expect.stringContaining("; Domain=example.com"))
  })

  it("handles an explicit maxAge", () => {
    const setter = vi.spyOn(document, "cookie", "set")
    setCookie("foo", "bar", { maxAge: 12345 })
    expect(setter).toHaveBeenCalledWith(expect.stringContaining("; Max-Age=12345"))
  })

  it("handles a maxAge of 'session'", () => {
    const setter = vi.spyOn(document, "cookie", "set")
    setCookie("foo", "bar", { maxAge: "session" })
    expect(setter).toHaveBeenCalledWith(expect.not.stringContaining("Max-Age="))
  })

  it("handles an explicit path", () => {
    const setter = vi.spyOn(document, "cookie", "set")
    setCookie("foo", "bar", { path: "/custom" })
    expect(setter).toHaveBeenCalledWith(expect.stringContaining("; Path=/custom"))
  })

  it("handles an empty-string path", () => {
    const setter = vi.spyOn(document, "cookie", "set")
    setCookie("foo", "bar", { path: "" })
    expect(setter).toHaveBeenCalledWith(expect.not.stringContaining("Path="))
  })

  it("handles an explicit sameSite", () => {
    const setter = vi.spyOn(document, "cookie", "set")
    setCookie("foo", "bar", { sameSite: "Strict" })
    expect(setter).toHaveBeenCalledWith(expect.stringContaining("; SameSite=Strict"))
  })

  it("handles an empty-string sameSite", () => {
    const setter = vi.spyOn(document, "cookie", "set")
    setCookie("foo", "bar", { sameSite: "" })
    expect(setter).toHaveBeenCalledWith(expect.not.stringContaining("SameSite="))
  })

  it("sets a secure cookie on HTTPS", () => {
    vi.spyOn(window.location, "protocol", "get").mockReturnValue("https:")
    const setter = vi.spyOn(document, "cookie", "set")
    setCookie("foo", "bar")
    expect(setter).toHaveBeenCalledWith(expect.stringContaining("; Secure"))
  })
})

describe("deleteCookie", () => {
  it("deletes a cookie with defaults", () => {
    const setter = vi.spyOn(document, "cookie", "set")
    setCookie("foo", "")
    expect(setter).toHaveBeenCalledWith("foo=; Path=/; SameSite=Lax; Max-Age=0")
  })

  it("deletes a cookie with an explicit domain", () => {
    const setter = vi.spyOn(document, "cookie", "set")
    setCookie("foo", "", { domain: "example.com" })
    expect(setter).toHaveBeenCalledWith(expect.stringContaining("; Domain=example.com"))
  })

  it("deletes a cookie with an explicit path", () => {
    const setter = vi.spyOn(document, "cookie", "set")
    setCookie("foo", "", { path: "/custom" })
    expect(setter).toHaveBeenCalledWith(expect.stringContaining("; Path=/custom"))
  })
})

describe("nukeCookie", () => {
  it("deletes a cookie with all domain permutations", () => {
    vi.spyOn(window.location, "hostname", "get").mockReturnValue("foo.bar.com")
    const setter = vi.spyOn(document, "cookie", "set")
    nukeCookie("baz")
    expect(setter).toHaveBeenCalledWith(expect.stringContaining("; Domain=foo.bar.com"))
    expect(setter).toHaveBeenCalledWith(expect.stringContaining("; Domain=bar.com"))
    expect(setter).toHaveBeenCalledWith(expect.not.stringContaining("; Domain="))
  })

  it("deletes a cookie with all pathname permutations", () => {
    vi.spyOn(window.location, "pathname", "get").mockReturnValue("/foo")
    const setter = vi.spyOn(document, "cookie", "set")
    nukeCookie("baz")
    expect(setter).toHaveBeenCalledWith(expect.stringContaining("; Path=/foo"))
    expect(setter).toHaveBeenCalledWith(expect.stringContaining("; Path=/fo"))
    expect(setter).toHaveBeenCalledWith(expect.stringContaining("; Path=/f"))
    expect(setter).toHaveBeenCalledWith(expect.stringContaining("; Path=/"))
    expect(setter).toHaveBeenCalledWith(expect.not.stringContaining("; Path="))
  })

  it("deletes a cookie with all explicit path permutations", () => {
    const setter = vi.spyOn(document, "cookie", "set")
    nukeCookie("baz", "/bar")
    expect(setter).toHaveBeenCalledWith(expect.stringContaining("; Path=/bar"))
    expect(setter).toHaveBeenCalledWith(expect.stringContaining("; Path=/ba"))
    expect(setter).toHaveBeenCalledWith(expect.stringContaining("; Path=/b"))
    expect(setter).toHaveBeenCalledWith(expect.stringContaining("; Path=/"))
    expect(setter).toHaveBeenCalledWith(expect.not.stringContaining("; Path="))
  })
})
