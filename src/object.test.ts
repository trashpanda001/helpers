import { getIn, invertObject, mapObject, putIn } from "@trashpanda001/helpers/object"
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

describe("putIn", () => {
  it("creates a new value on an object", () => {
    const input = {}
    putIn(input, "a", 100)
    expect(input).toEqual({ a: 100 })
  })

  it("overwrites a value in an object", () => {
    const input = { a: 42 }
    putIn(input, "a", 100)
    expect(input).toEqual({ a: 100 })
  })

  it("creates a new value in an array", () => {
    const input = [42]
    putIn(input, "2", 100)
    expect(input).toEqual([42, undefined, 100])
  })

  it("overwrites a value in an array", () => {
    const input = [42]
    putIn(input, "0", 100)
    expect(input).toEqual([100])
  })

  it("traverses nested objects", () => {
    const input = { a: { b: { c: 42 } } }
    putIn(input, "a.b.c", 100)
    expect(input).toEqual({ a: { b: { c: 100 } } })
  })

  it("traverses nested arrays ", () => {
    const input = { a: [{ c: 42 }, { c: 43 }] }
    putIn(input, "a.1.c", 100)
    expect(input).toEqual({ a: [{ c: 42 }, { c: 100 }] })
  })

  it("creates a new array entry", () => {
    const input = { a: [{ c: 42 }] }
    putIn(input, "a.1", { c: 100 })
    expect(input).toEqual({ a: [{ c: 42 }, { c: 100 }] })
  })

  it("creates new objects as needed", () => {
    const input = {}
    putIn(input, "a.b.c", 100)
    expect(input).toEqual({ a: { b: { c: 100 } } })
  })

  it("creates new arrays as needed", () => {
    const input = { a: [] }
    putIn(input, "a.0.1", 100)
    expect(input).toEqual({ a: [[undefined, 100]] })
  })

  it("throws an error if traversing a primitive", () => {
    const input = { a: { b: "cat" } }
    expect(() => putIn(input, "a.b.c", 100)).toThrow(Error)
  })

  it("throws an error if traversing null", () => {
    const input = { a: { b: null } }
    expect(() => putIn(input, "a.b.c", 100)).toThrow(Error)
  })

  it("throws an error if array and expected an object", () => {
    const input = { a: [{ c: 42 }] }
    expect(() => putIn(input, "a.b.c", 100)).toThrow(Error)
  })

  it("throws an error if object and expected an array", () => {
    const input = { a: { b: { c: 42 } } }
    expect(() => putIn(input, "a.0.c", 100)).toThrow(Error)
  })

  it("does nothing if path is empty", () => {
    const input: unknown[] = []
    putIn(input, "", 100)
    expect(input).toEqual([])

    const input2 = {}
    putIn(input2, "", 100)
    expect(input2).toEqual({})
  })
})
