import { clamp, distance, mod, quantize, randomFloat, randomInt } from "@trashpanda001/helpers/number"
import { describe, expect, it, vi } from "vitest"

describe("clamp", () => {
  it("returns value when within range", () => {
    expect(clamp(5, 0, 10)).toBe(5)
  })

  it("returns min when value is below range", () => {
    expect(clamp(-5, 0, 10)).toBe(0)
  })

  it("returns max when value is above range", () => {
    expect(clamp(15, 0, 10)).toBe(10)
  })
})

describe("distance", () => {
  it("calculates Euclidean distance between two points", () => {
    expect(distance(0, 0, 3, 4)).toBe(5)
    expect(distance(1, 2, 4, 6)).toBeCloseTo(5)
  })
})

describe("mod", () => {
  it("returns positive remainder for positive dividend", () => {
    expect(mod(5, 2)).toBe(1)
  })

  it("returns positive remainder for negative dividend", () => {
    expect(mod(-5, 2)).toBe(1)
  })

  it("returns zero when divisible", () => {
    expect(mod(4, 2)).toBe(0)
  })

  it("throws RangeError if divisor is zero", () => {
    expect(() => mod(5, 0)).toThrow(RangeError)
  })
})

describe("quantize", () => {
  it("rounds down when below midpoint", () => {
    expect(quantize(31, 5)).toBe(30)
  })

  it("rounds up when above midpoint", () => {
    expect(quantize(32, 5)).toBe(30)
    expect(quantize(33, 5)).toBe(35)
  })

  it("throws RangeError if step is not positive", () => {
    expect(() => quantize(10, 0)).toThrow(RangeError)
    expect(() => quantize(10, -2)).toThrow(RangeError)
  })
})

describe("randomFloat", () => {
  it("generates between 0 and min when max is undefined", () => {
    vi.spyOn(Math, "random").mockReturnValue(0.5)
    expect(randomFloat(100)).toBe(50)
  })

  it("generates between min and max when both provided", () => {
    vi.spyOn(Math, "random").mockReturnValue(0.25)
    expect(randomFloat(10, 20)).toBe(12.5)
  })
})

describe("randomInt", () => {
  it("floors the random float result", () => {
    vi.spyOn(Math, "random").mockReturnValue(0.99)
    // randomFloat(0, 10) => 9.9, floored to 9
    expect(randomInt(0, 10)).toBe(9)
  })

  it("uses 0 as min when max is undefined", () => {
    vi.spyOn(Math, "random").mockReturnValue(0.1)
    // randomFloat(100) => 10, floored to 10
    expect(randomInt(100)).toBe(10)
  })
})
