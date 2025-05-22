import {
  capitalize,
  chunkEvery,
  countable,
  decode64,
  encode64,
  encodeRfc3986,
  encodeUrlParams,
  hashCode,
  hostname,
  styleToString,
  unprefixName,
  urlDecode64,
  urlEncode64,
  type Primitive,
} from "@trashpanda001/helpers/string"
import { describe, expect, it } from "vitest"

describe("capitalize", () => {
  it("should capitalize the first letter", () => {
    expect(capitalize("bob")).toBe("Bob")
  })

  it("should capitalize the first letter of the first word only", () => {
    expect(capitalize("bob moses")).toBe("Bob moses")
  })

  it("should return an empty string if the input is empty", () => {
    expect(capitalize("")).toBe("")
  })

  it("should handle single character strings", () => {
    expect(capitalize("a")).toBe("A")
  })
})

describe("chunkEvery", () => {
  it("returns an empty array when the input is an empty empty", () => {
    expect(chunkEvery("", 3)).toEqual([])
  })

  it("returns a single chunk when size >= string length", () => {
    const string = "abc"
    expect(chunkEvery(string, 3)).toEqual(["abc"])
    expect(chunkEvery(string, 5)).toEqual(["abc"])
  })

  it("splits into chunks of the given size", () => {
    const string = "hello"
    expect(chunkEvery(string, 2)).toEqual(["he", "ll", "o"])
  })

  it("handles a chunk size of one", () => {
    expect(chunkEvery("abc", 1)).toEqual(["a", "b", "c"])
  })

  it("throws if the chunk size is zero or negative", () => {
    expect(() => chunkEvery("abc", 0)).toThrow()
    expect(() => chunkEvery("abc", -1)).toThrow()
  })
})

describe("countable", () => {
  it("returns singular for count = 1", () => {
    expect(countable(1, "item")).toEqual("1 item")
  })

  it("returns plural for count = 0", () => {
    expect(countable(0, "item")).toBe("0 items")
  })

  it("uses custom plural when provided", () => {
    expect(countable(2, "person", "people")).toBe("2 people")
  })
})

describe("encode64/decode64", () => {
  const sample = "hello world"

  it("encodes to base64 without padding by default", () => {
    const enc = encode64(sample)
    expect(enc.endsWith("=")).toBe(false)
  })

  it("encodes with padding when requested", () => {
    const enc = encode64(sample, true)
    expect(enc.endsWith("=")).toBe(true)
  })

  it("decodes what encode64 produces", () => {
    const enc = encode64(sample, true)
    expect(decode64(enc)).toBe(sample)
  })
})

describe("encodeRfc3986", () => {
  it("percent-encodes reserved characters", () => {
    const s = "a !'()*&?"
    const enc = encodeRfc3986(s)
    expect(enc).toContain("%20")
    expect(enc).toContain("%21")
    expect(enc).toContain("%27")
    expect(enc).toContain("%28")
    expect(enc).toContain("%29")
    expect(enc).toContain("%2a")
  })
})

describe("hashCode", () => {
  it("produces a consistent integer hash", () => {
    expect(hashCode("abc")).toBe(108966)
    expect(hashCode("")).toBe(0)
    expect(hashCode("abc")).toBe(hashCode("abc"))
  })
})

describe("hostname", () => {
  it("extracts hostname from a valid URL", () => {
    expect(hostname("https://example.com/path")).toBe("example.com")
  })

  it("returns empty string on empty input", () => {
    expect(hostname("")).toBe("")
  })

  it("returns empty string on invalid URL", () => {
    expect(hostname("not a url")).toBe("")
  })

  it("handles URL objects", () => {
    const url = new URL("https://subdomain.example.org:8080/path?query=value")
    expect(hostname(url)).toBe("subdomain.example.org")
  })

  it("handles null input", () => {
    expect(hostname(null)).toBe("")
  })

  it("extracts hostname without port", () => {
    expect(hostname("https://example.com:8080/path")).toBe("example.com")
  })

  it("handles URLs with subdomains", () => {
    expect(hostname("https://api.example.com/v1")).toBe("api.example.com")
  })
})

describe("styleToString", () => {
  it("converts camelCase properties to kebab-case", () => {
    const styles = { backgroundColor: "red", fontSize: "12px" }
    expect(styleToString(styles)).toBe("background-color:red;font-size:12px")
  })

  it("omits null or undefined values", () => {
    const styles = { color: null, margin: undefined, padding: "5px" }
    expect(styleToString(styles)).toBe("padding:5px")
  })
})

describe("unprefixName", () => {
  it("removes 'the', 'a', 'an' prefixes case-insensitively", () => {
    expect(unprefixName("The Beatles")).toBe("Beatles")
    expect(unprefixName("a Something")).toBe("Something")
    expect(unprefixName("An Adventure")).toBe("Adventure")
  })

  it("does not remove when prefix is part of word", () => {
    expect(unprefixName("Theodore")).toBe("Theodore")
  })
})

describe("urlDecode64/urlEncode64", () => {
  const sample = "A/B+C"

  it("encodes and decodes with URL-safe alphabet", () => {
    const enc = urlEncode64(sample)
    expect(enc).not.toContain("+")
    expect(enc).not.toContain("/")
    expect(urlDecode64(enc)).toBe(sample)
  })

  it("respects padding flag", () => {
    const encPad = urlEncode64(sample, true)
    expect(encPad.endsWith("=")).toBe(true)
    expect(urlDecode64(encPad)).toBe(sample)
  })
})

describe("encodeUrlParams", () => {
  it("encodes passed parameters", () => {
    const url = encodeUrlParams("/search", { a: null, limit: 200, query: "foo bar", z: undefined })
    expect(url).toBe("/search?limit=200&query=foo+bar")
  })

  it("encodes empty parameters object", () => {
    const url = encodeUrlParams("/empty", {})
    expect(url).toBe("/empty")
  })

  it("merges parameters with existing query string", () => {
    const url = encodeUrlParams("/search?limit=200", { query: "foo" })
    expect(url).toBe("/search?limit=200&query=foo")
  })

  it("overrides query string with parameters", () => {
    const url = encodeUrlParams("/search?limit=200&foo=bar", { foo: null, limit: 50 })
    expect(url).toBe("/search?limit=50")
  })

  it("supports absolute string URLs", () => {
    const url = encodeUrlParams("https://google.com/?q=foo", { q: "bar" })
    expect(url).toBe("https://google.com/?q=bar")
    const url2 = encodeUrlParams("http://google.com/?q=foo", { q: "bar" })
    expect(url2).toBe("http://google.com/?q=bar")
  })

  it("supports real URL objects", () => {
    const url = new URL("https://google.com/?q=foo")
    const encodedUrl = encodeUrlParams(url, { q: "bar" })
    expect(encodedUrl).toBe("https://google.com/?q=bar")
  })

  it("handles numeric parameter values", () => {
    const url = encodeUrlParams("/page", { id: 123, score: 98.6 })
    expect(url).toBe("/page?id=123&score=98.6")
  })

  it("handles boolean parameter values", () => {
    const url = encodeUrlParams("/settings", { enabled: true, visible: false })
    expect(url).toBe("/settings?enabled=true&visible=false")
  })

  it("handles special characters in parameter values", () => {
    const url = encodeUrlParams("/search", { query: "a&b=c?d#e+" })
    expect(url).toBe("/search?query=a%26b%3Dc%3Fd%23e%2B")
  })

  it("preserves hash fragments", () => {
    const url = encodeUrlParams("/page#section1", { q: "test" })
    expect(url).toBe("/page?q=test#section1")
  })

  it("accepts URLSearchParams as parameters", () => {
    const params = new URLSearchParams({ limit: "50", query: "search term" })
    const url = encodeUrlParams("/api", params)
    expect(url).toBe("/api?limit=50&query=search+term")
  })

  it("accepts arrays as parameters", () => {
    const params: Array<[string, Primitive]> = [
      ["limit", 50],
      ["query", "search term"],
    ]
    const url = encodeUrlParams("/api", params)
    expect(url).toBe("/api?limit=50&query=search+term")
  })

  it("accepts string as parameters", () => {
    const params = "limit=50&query=search+term"
    const url = encodeUrlParams("/api", params)
    expect(url).toBe("/api?limit=50&query=search+term")
  })

  it("accepts ?-prefixed string as parameters", () => {
    const params = "?limit=50&query=search+term"
    const url = encodeUrlParams("/api", params)
    expect(url).toBe("/api?limit=50&query=search+term")
  })
})
