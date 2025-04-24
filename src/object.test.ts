import { describe, expect, it } from "vitest"
import { invertObject, mapObject } from "./object.js"

describe("mapObject", () => {
  it("maps keys and values according to the mapping function", () => {
    const input = { a: "alpha", b: "beta" }
    const result = mapObject(input, ([key, value]) => [value.toUpperCase(), key.repeat(2)])
    expect(result).toEqual({ ALPHA: "aa", BETA: "bb" })
  })

  it("handles an empty object", () => {
    const result = mapObject({}, ([k, v]) => [v, k])
    expect(result).toEqual({})
  })

  it("overwrites duplicate keys, keeping the last entry", () => {
    const input = { first: "dup", second: "dup", third: "unique" }
    const result = mapObject(input, ([k, v]) => [v, k])
    expect(result).toEqual({ dup: "second", unique: "third" })
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

  // it("coerces non-string values to strings when inverting", () => {
  //   // es-lint-disable-next-line @typescript-eslint/no-explicit-any
  //   const input = { a: 1, b: 2, c: 1 }
  //   const result = invertObject(input)
  //   expect(result).toEqual({
  //     "1": "c", // last entry for value 1
  //     "2": "b",
  //   })
  // })
})
