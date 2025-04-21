import { beforeEach, describe, expect, it, vi } from "vitest"
import { getCookie, getCookies, nukeCookie, setCookie } from "./cookies.js"

function removeAllCookies() {
  document.cookie.split("; ").forEach((cookie) => {
    const [name] = cookie.split("=")
    document.cookie = `${name}=; Max-Age=-1` // happy-dom doesn't expire with Max-Age=0
  })
}

describe("getCookie", () => {
  beforeEach(removeAllCookies)

  it("should return the value of an existing cookie", () => {
    document.cookie = "testCookie=testValue"
    expect(getCookie("testCookie")).toBe("testValue")
  })

  it("should return an empty string for a non-existing cookie", () => {
    expect(getCookie("nonExistingCookie")).toBe("")
  })

  it("should decode URI-encoded cookie values", () => {
    document.cookie = "symbolsCookie=%21%40%23%24%25"
    expect(getCookie("symbolsCookie")).toBe("!@#$%")
  })

  it("should retrieve the correct cookie when multiple cookies are set", () => {
    document.cookie = "firstCookie=value1"
    document.cookie = "secondCookie=value2"
    document.cookie = "thirdCookie=value3"
    expect(getCookie("firstCookie")).toBe("value1")
    expect(getCookie("firstCookie")).toBe("value1")
    expect(getCookie("thirdCookie")).toBe("value3")
  })

  it("should handle cookies with special characters in values", () => {
    document.cookie = "specialCookie=value with spaces"
    document.cookie = "jsonCookie=%7B%22key%22%3A%22value%22%7D"
    document.cookie = "symbolsCookie=%21%40%23%24%25"
    expect(getCookie("specialCookie")).toBe("value with spaces")
    expect(getCookie("jsonCookie")).toBe('{"key":"value"}')
    expect(getCookie("symbolsCookie")).toBe("!@#$%")
  })

  it("should correctly handle cookies with same name prefix", () => {
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

  it("should return an empty object in there are no cookies", () => {
    expect(getCookies()).toEqual({})
  })

  it("should return all cookies as a key-value object", () => {
    document.cookie = "firstCookie=value1"
    document.cookie = "secondCookie=value2"
    document.cookie = "thirdCookie=value3"

    expect(getCookies()).toEqual({
      firstCookie: "value1",
      secondCookie: "value2",
      thirdCookie: "value3",
    })
  })

  it("should decode URI-encoded cookie values", () => {
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

describe("setCookie", () => {
  it("should use defaults", () => {
    const setter = vi.spyOn(document, "cookie", "set")
    setCookie("foo", "bar")
    expect(setter).toHaveBeenCalledWith("foo=bar; Path=/; SameSite=Lax; Max-Age=34560000")
  })

  it("should delete a cookie with an empty value", () => {
    const setter = vi.spyOn(document, "cookie", "set")
    setCookie("foo", "")
    expect(setter).toHaveBeenCalledWith("foo=; Path=/; SameSite=Lax; Max-Age=0")
  })

  it("should URI-encode the cookie value", () => {
    const setter = vi.spyOn(document, "cookie", "set")
    setCookie("special", "a value with spaces & symbols!")
    expect(setter).toHaveBeenCalledWith(expect.stringContaining("special=a%20value%20with%20spaces%20%26%20symbols!"))
  })

  it("should handle setting an explicit domain", () => {
    const setter = vi.spyOn(document, "cookie", "set")
    setCookie("foo", "bar", { domain: "example.com" })
    expect(setter).toHaveBeenCalledWith(expect.stringContaining("; Domain=example.com"))
  })

  it("should handle an explicit maxAge", () => {
    const setter = vi.spyOn(document, "cookie", "set")
    setCookie("foo", "bar", { maxAge: 12345 })
    expect(setter).toHaveBeenCalledWith(expect.stringContaining("; Max-Age=12345"))
  })

  it("should handle a maxAge of session", () => {
    const setter = vi.spyOn(document, "cookie", "set")
    setCookie("foo", "bar", { maxAge: "session" })
    expect(setter).toHaveBeenCalledWith(expect.not.stringContaining("Max-Age="))
  })

  it("should handle an explicit path", () => {
    const setter = vi.spyOn(document, "cookie", "set")
    setCookie("foo", "bar", { path: "/custom" })
    expect(setter).toHaveBeenCalledWith(expect.stringContaining("; Path=/custom"))
  })

  it("should handle a no/empty-string path", () => {
    const setter = vi.spyOn(document, "cookie", "set")
    setCookie("foo", "bar", { path: "" })
    expect(setter).toHaveBeenCalledWith(expect.not.stringContaining("Path="))
  })

  it("should handle an explicit sameSite", () => {
    const setter = vi.spyOn(document, "cookie", "set")
    setCookie("foo", "bar", { sameSite: "Strict" })
    expect(setter).toHaveBeenCalledWith(expect.stringContaining("; SameSite=Strict"))
  })

  it("should handle a no/empty-string sameSite", () => {
    const setter = vi.spyOn(document, "cookie", "set")
    setCookie("foo", "bar", { sameSite: "" })
    expect(setter).toHaveBeenCalledWith(expect.not.stringContaining("SameSite="))
  })

  it("should set a secure cookie on HTTPS", () => {
    vi.spyOn(window.location, "protocol", "get").mockReturnValue("https:")
    const setter = vi.spyOn(document, "cookie", "set")
    setCookie("foo", "bar")
    expect(setter).toHaveBeenCalledWith(expect.stringContaining("; Secure"))
  })
})

describe("deleteCookie", () => {
  it("should delete a cookie with defaults", () => {
    const setter = vi.spyOn(document, "cookie", "set")
    setCookie("foo", "")
    expect(setter).toHaveBeenCalledWith("foo=; Path=/; SameSite=Lax; Max-Age=0")
  })

  it("should delete a cookie with an explicit domain", () => {
    const setter = vi.spyOn(document, "cookie", "set")
    setCookie("foo", "", { domain: "example.com" })
    expect(setter).toHaveBeenCalledWith(expect.stringContaining("; Domain=example.com"))
  })

  it("should delete a cookie with an explicit path", () => {
    const setter = vi.spyOn(document, "cookie", "set")
    setCookie("foo", "", { path: "/custom" })
    expect(setter).toHaveBeenCalledWith(expect.stringContaining("; Path=/custom"))
  })
})

describe("nukeCookie", () => {
  it("should delete a cookie with all domain permutations", () => {
    vi.spyOn(window.location, "hostname", "get").mockReturnValue("foo.bar.com")
    const setter = vi.spyOn(document, "cookie", "set")
    nukeCookie("baz")
    expect(setter).toHaveBeenCalledWith(expect.stringContaining("; Domain=foo.bar.com"))
    expect(setter).toHaveBeenCalledWith(expect.stringContaining("; Domain=bar.com"))
    expect(setter).toHaveBeenCalledWith(expect.not.stringContaining("; Domain="))
  })

  it("should delete a cookie with all pathname permutations", () => {
    vi.spyOn(window.location, "pathname", "get").mockReturnValue("/foo")
    const setter = vi.spyOn(document, "cookie", "set")
    nukeCookie("baz")
    expect(setter).toHaveBeenCalledWith(expect.stringContaining("; Path=/foo"))
    expect(setter).toHaveBeenCalledWith(expect.stringContaining("; Path=/fo"))
    expect(setter).toHaveBeenCalledWith(expect.stringContaining("; Path=/f"))
    expect(setter).toHaveBeenCalledWith(expect.stringContaining("; Path=/"))
    expect(setter).toHaveBeenCalledWith(expect.not.stringContaining("; Path="))
  })

  it("should delete a cookie with all explicit path permutations", () => {
    const setter = vi.spyOn(document, "cookie", "set")
    nukeCookie("baz", "/bar")
    expect(setter).toHaveBeenCalledWith(expect.stringContaining("; Path=/bar"))
    expect(setter).toHaveBeenCalledWith(expect.stringContaining("; Path=/ba"))
    expect(setter).toHaveBeenCalledWith(expect.stringContaining("; Path=/b"))
    expect(setter).toHaveBeenCalledWith(expect.stringContaining("; Path=/"))
    expect(setter).toHaveBeenCalledWith(expect.not.stringContaining("; Path="))
  })
})
