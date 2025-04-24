import { describe, expect, it } from "vitest"
import {
  capitalize,
  countable,
  decode64,
  encode64,
  encodeRfc3986,
  hashCode,
  hostname,
  styleToString,
  unprefixName,
  urlDecode64,
  urlEncode64,
} from "./string.js"

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

describe("countable", () => {
  it("returns singular for count = 1", () => {
    expect(countable(1, "item")).toBe("1 item")
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
