// @vitest-environment node
import { decode64, encode64 } from "@trashpanda001/helpers/string"
import { describe, expect, it } from "vitest"

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
