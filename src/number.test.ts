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
  it("generates integers between 0 and min when max is undefined", () => {
    vi.spyOn(Math, "random").mockReturnValue(0.99)
    // randomFloat(100) => 99, floored to 99
    expect(randomInt(100)).toBe(99)
  })

  it("generates integers between min and max when both provided", () => {
    vi.spyOn(Math, "random").mockReturnValue(0.5)
    // randomFloat(5, 10) => 7.5, floored to 7
    expect(randomInt(5, 10)).toBe(7)
  })

  it("returns min when random is 0", () => {
    vi.spyOn(Math, "random").mockReturnValue(0)
    expect(randomInt(5, 10)).toBe(5)
  })

  it("returns max-1 when random is close to 1", () => {
    vi.spyOn(Math, "random").mockReturnValue(0.999999)
    expect(randomInt(5, 10)).toBe(9)
  })

  it("handles negative ranges", () => {
    vi.spyOn(Math, "random").mockReturnValue(0.5)
    expect(randomInt(-5, 5)).toBe(0)
  })

  it("handles single value range", () => {
    vi.spyOn(Math, "random").mockReturnValue(0.5)
    expect(randomInt(5, 6)).toBe(5)
  })

  it("avoids modulo bias by ensuring uniform distribution", () => {
    const min = 0
    const max = 10
    const iterations = 10000
    const counts = new Array(max - min).fill(0)

    // Collect many samples
    for (let i = 0; i < iterations; i++) {
      const result = randomInt(min, max)
      counts[result - min]++
    }

    // Check that all values are generated
    counts.forEach((count, _index) => {
      expect(count).toBeGreaterThan(0)
    })

    // Check that distribution is roughly uniform (within 20% tolerance)
    const expectedCount = iterations / (max - min)
    counts.forEach((count, _index) => {
      expect(count).toBeGreaterThan(expectedCount * 0.8)
      expect(count).toBeLessThan(expectedCount * 1.2)
    })
  })

  it("avoids modulo bias for larger ranges", () => {
    const min = 0
    const max = 100
    const iterations = 50000
    const counts = new Array(max - min).fill(0)

    // Collect many samples
    for (let i = 0; i < iterations; i++) {
      const result = randomInt(min, max)
      counts[result - min]++
    }

    // Check that all values are generated
    counts.forEach((count, _index) => {
      expect(count).toBeGreaterThan(0)
    })

    // Check that distribution is roughly uniform (within 25% tolerance for larger range)
    const expectedCount = iterations / (max - min)
    counts.forEach((count, _index) => {
      expect(count).toBeGreaterThan(expectedCount * 0.75)
      expect(count).toBeLessThan(expectedCount * 1.25)
    })
  })

  it("handles edge case where range is 1", () => {
    vi.spyOn(Math, "random").mockReturnValue(0.5)
    expect(randomInt(5, 6)).toBe(5)
  })

  it("handles edge case where range is 2", () => {
    vi.spyOn(Math, "random").mockReturnValue(0.5)
    expect(randomInt(5, 7)).toBe(6)
  })
})
