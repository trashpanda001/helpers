import { getIn, invertObject, mapObject } from "@trashpanda001/helpers/object"
import { describe, expect, it } from "vitest"

describe("getIn", () => {
  it("retrieves a value from a nested object using dot notation", () => {
    const input = { a: { b: { c: 42 } } }
    const result = getIn(input, "a.b.c")
    expect(result).toBe(42)
  })

  it("returns undefined when path does not exist", () => {
    const input = { a: { b: { c: 42 } } }
    expect(getIn(input, "a.b.d")).toBeUndefined()
    expect(getIn(input, "a.z")).toBeUndefined()
    expect(getIn(input, "z")).toBeUndefined()
  })

  it("handles array access", () => {
    const input = { items: [{ id: 1 }, { id: 2 }] }
    expect(getIn(input, "items.0.id")).toBe(1)
    expect(getIn(input, "items.1.id")).toBe(2)
  })

  it("handles empty path", () => {
    const input = { a: 1 }
    expect(getIn(input, "")).toBe(undefined)
  })

  it("handles values that are null or undefined", () => {
    const input = { a: { b: null, c: undefined } }
    expect(getIn(input, "a.b")).toBeNull()
    expect(getIn(input, "a.c")).toBeUndefined()
    expect(getIn(input, "a.b.d")).toBeUndefined()
  })

  it("works with non-object values in the middle of the path", () => {
    const input = { a: { b: 42 } }
    expect(getIn(input, "a.b.c")).toBeUndefined()
  })
})

describe("invertObject", () => {
  it("inverts keys and values", () => {
    const input = { a: "alpha", b: "beta" }
    const result = invertObject(input)
    expect(result).toEqual({ alpha: "a", beta: "b" })
  })

  it("handles empty object", () => {
    expect(invertObject({})).toEqual({})
  })

  it("overwrites duplicate values, keeping the last key", () => {
    const input = { x: "dup", y: "dup" }
    const result = invertObject(input)
    expect(result).toEqual({ dup: "y" })
  })

  it("coerces non-string values to strings when inverting", () => {
    const input = { a: 1, b: 2, c: 1 }
    const result = invertObject(input)
    expect(result).toEqual({ "1": "c", "2": "b" })
  })
})

describe("mapObject", () => {
  it("maps keys and values according to the mapping function", () => {
    const input = { a: "alpha", b: "beta" }
    const result = mapObject(input, ([key, value]) => [value.toUpperCase(), key.repeat(2)])
    expect(result).toEqual({ ALPHA: "aa", BETA: "bb" })
  })

  it("handles an empty object", () => {
    const input: Record<string, string> = {}
    const result = mapObject(input, ([k, v]) => [v, k])
    expect(result).toEqual({})
  })

  it("overwrites duplicate keys, keeping the last entry", () => {
    const input = { first: "dup", second: "dup", third: "unique" }
    const result = mapObject(input, ([k, v]) => [v, k])
    expect(result).toEqual({ dup: "second", unique: "third" })
  })
})
