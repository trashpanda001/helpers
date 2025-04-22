import { describe, expect, it } from "vitest"
import { capitalize } from "./string.js"

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
