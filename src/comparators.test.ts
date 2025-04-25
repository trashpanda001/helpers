import {
  compareBooleansAsc,
  compareBooleansDesc,
  compareDatesAsc,
  compareDatesDesc,
  compareNumbersAsc,
  compareNumbersDesc,
  compareStrings,
  compareStringsNatural,
  compareStringsNaturalReversed,
  compareStringsReversed,
} from "@trashpanda001/helpers/comparators"
import { DateTime } from "luxon"
import { describe, expect, it } from "vitest"

describe("compareBooleansAsc", () => {
  it("sorts false before true", () => {
    expect(compareBooleansAsc(false, true)).toBeLessThan(0)
    expect(compareBooleansAsc(true, false)).toBeGreaterThan(0)
  })

  it("considers equal values as equal", () => {
    expect(compareBooleansAsc(true, true)).toBe(0)
    expect(compareBooleansAsc(false, false)).toBe(0)
  })

  it("sorts null and undefined last", () => {
    expect(compareBooleansAsc(false, null)).toBeLessThan(0)
    expect(compareBooleansAsc(true, undefined)).toBeLessThan(0)
    expect(compareBooleansAsc(null, false)).toBeGreaterThan(0)
    expect(compareBooleansAsc(undefined, true)).toBeGreaterThan(0)
    expect(compareBooleansAsc(null, undefined)).toBe(0)
  })
})

describe("compareBooleansDesc", () => {
  it("sorts true before false", () => {
    expect(compareBooleansDesc(true, false)).toBeLessThan(0)
    expect(compareBooleansDesc(false, true)).toBeGreaterThan(0)
  })

  it("considers equal values as equal", () => {
    expect(compareBooleansDesc(true, true)).toBe(0)
    expect(compareBooleansDesc(false, false)).toBe(0)
  })

  it("sorts null and undefined last", () => {
    expect(compareBooleansDesc(false, null)).toBeLessThan(0)
    expect(compareBooleansDesc(true, undefined)).toBeLessThan(0)
    expect(compareBooleansDesc(null, false)).toBeGreaterThan(0)
    expect(compareBooleansDesc(undefined, true)).toBeGreaterThan(0)
  })
})

describe("compareNumbersAsc", () => {
  it("sorts numbers in ascending order", () => {
    expect(compareNumbersAsc(1, 2)).toBeLessThan(0)
    expect(compareNumbersAsc(2, 1)).toBeGreaterThan(0)
    expect(compareNumbersAsc(1, 1)).toBe(0)
  })

  it("handles negative numbers", () => {
    expect(compareNumbersAsc(-1, 1)).toBeLessThan(0)
    expect(compareNumbersAsc(-2, -1)).toBeLessThan(0)
  })

  it("sorts null and undefined last", () => {
    expect(compareNumbersAsc(0, null)).toBeLessThan(0)
    expect(compareNumbersAsc(100, undefined)).toBeLessThan(0)
    expect(compareNumbersAsc(null, 0)).toBeGreaterThan(0)
    expect(compareNumbersAsc(undefined, -100)).toBeGreaterThan(0)
    expect(compareNumbersAsc(null, undefined)).toBe(0)
  })
})

describe("compareNumbersDesc", () => {
  it("sorts numbers in descending order", () => {
    expect(compareNumbersDesc(2, 1)).toBeLessThan(0)
    expect(compareNumbersDesc(1, 2)).toBeGreaterThan(0)
    expect(compareNumbersDesc(1, 1)).toBe(0)
  })

  it("handles negative numbers", () => {
    expect(compareNumbersDesc(1, -1)).toBeLessThan(0)
    expect(compareNumbersDesc(-1, -2)).toBeLessThan(0)
  })

  it("sorts null and undefined last", () => {
    expect(compareNumbersDesc(0, null)).toBeLessThan(0)
    expect(compareNumbersDesc(-100, undefined)).toBeLessThan(0)
    expect(compareNumbersDesc(null, 0)).toBeGreaterThan(0)
    expect(compareNumbersDesc(undefined, 100)).toBeGreaterThan(0)
  })
})

describe("compareDatesAsc", () => {
  it("sorts dates in ascending order", () => {
    const earlier = new Date(2020, 0, 1)
    const later = new Date(2021, 0, 1)
    expect(compareDatesAsc(earlier, later)).toBeLessThan(0)
    expect(compareDatesAsc(later, earlier)).toBeGreaterThan(0)
    expect(compareDatesAsc(earlier, new Date(2020, 0, 1))).toBe(0)
  })

  it("handles DateTime objects", () => {
    const earlier = DateTime.fromObject({ day: 1, month: 1, year: 2020 })
    const later = DateTime.fromObject({ day: 1, month: 1, year: 2021 })
    expect(compareDatesAsc(earlier, later)).toBeLessThan(0)
    expect(compareDatesAsc(later, earlier)).toBeGreaterThan(0)
  })

  it("can compare Date and DateTime objects", () => {
    const dateObj = new Date(2020, 0, 1)
    const dateTimeObj = DateTime.fromObject({ day: 1, month: 1, year: 2020 })
    expect(compareDatesAsc(dateObj, dateTimeObj)).toBe(0)
  })

  it("sorts null and undefined last", () => {
    const date = new Date()
    expect(compareDatesAsc(date, null)).toBeLessThan(0)
    expect(compareDatesAsc(date, undefined)).toBeLessThan(0)
    expect(compareDatesAsc(null, date)).toBeGreaterThan(0)
    expect(compareDatesAsc(undefined, date)).toBeGreaterThan(0)
  })
})

describe("compareDatesDesc", () => {
  it("sorts dates in descending order", () => {
    const earlier = new Date(2020, 0, 1)
    const later = new Date(2021, 0, 1)
    expect(compareDatesDesc(later, earlier)).toBeLessThan(0)
    expect(compareDatesDesc(earlier, later)).toBeGreaterThan(0)
    expect(compareDatesDesc(earlier, new Date(2020, 0, 1))).toBe(0)
  })

  it("sorts null and undefined last", () => {
    const date = new Date()
    expect(compareDatesDesc(date, null)).toBeLessThan(0)
    expect(compareDatesDesc(date, undefined)).toBeLessThan(0)
  })
})

describe("compareStrings", () => {
  it("sorts strings alphabetically", () => {
    expect(compareStrings("a", "b")).toBeLessThan(0)
    expect(compareStrings("b", "a")).toBeGreaterThan(0)
    expect(compareStrings("a", "a")).toBe(0)
  })

  it("sorts empty strings, null and undefined last", () => {
    expect(compareStrings("a", "")).toBeLessThan(0)
    expect(compareStrings("a", null)).toBeLessThan(0)
    expect(compareStrings("a", undefined)).toBeLessThan(0)
    expect(compareStrings("", "a")).toBeGreaterThan(0)
    expect(compareStrings(null, "a")).toBeGreaterThan(0)
    expect(compareStrings(undefined, "a")).toBeGreaterThan(0)
  })
})

describe("compareStringsNatural", () => {
  it("sorts strings with numbers naturally", () => {
    expect(compareStringsNatural("file1", "file2")).toBeLessThan(0)
    expect(compareStringsNatural("file10", "file2")).toBeGreaterThan(0)
  })

  it("sorts empty strings, null and undefined last", () => {
    expect(compareStringsNatural("a", "")).toBeLessThan(0)
    expect(compareStringsNatural("a", null)).toBeLessThan(0)
    expect(compareStringsNatural("a", undefined)).toBeLessThan(0)
  })
})

describe("compareStringsReversed", () => {
  it("sorts strings in reverse alphabetical order", () => {
    expect(compareStringsReversed("b", "a")).toBeLessThan(0)
    expect(compareStringsReversed("a", "b")).toBeGreaterThan(0)
  })

  it("sorts empty strings, null and undefined last", () => {
    expect(compareStringsReversed("a", "")).toBeLessThan(0)
    expect(compareStringsReversed("a", null)).toBeLessThan(0)
    expect(compareStringsReversed("a", undefined)).toBeLessThan(0)
  })
})

describe("compareStringsNaturalReversed", () => {
  it("sorts strings with numbers in reverse natural order", () => {
    expect(compareStringsNaturalReversed("file2", "file1")).toBeLessThan(0)
    expect(compareStringsNaturalReversed("file2", "file10")).toBeGreaterThan(0)
  })

  it("sorts empty strings, null and undefined last", () => {
    expect(compareStringsNaturalReversed("a", "")).toBeLessThan(0)
    expect(compareStringsNaturalReversed("a", null)).toBeLessThan(0)
    expect(compareStringsNaturalReversed("a", undefined)).toBeLessThan(0)
  })
})
