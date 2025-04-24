import { chunkEvery, findValue, shuffleArray, uniq, uniqBy } from "@trashpanda001/helpers/array"
import { describe, expect, it } from "vitest"

describe("chunkEvery", () => {
  it("returns an empty array when the input is empty", () => {
    expect(chunkEvery([], 3)).toEqual([])
  })

  it("returns a single chunk when size >= array length", () => {
    const arr = [1, 2, 3]
    expect(chunkEvery(arr, 3)).toEqual([[1, 2, 3]])
    expect(chunkEvery(arr, 5)).toEqual([[1, 2, 3]])
  })

  it("splits into chunks of the given size", () => {
    const arr = [1, 2, 3, 4, 5]
    expect(chunkEvery(arr, 2)).toEqual([[1, 2], [3, 4], [5]])
  })

  it("handles a chunk size of one", () => {
    expect(chunkEvery([1, 2, 3], 1)).toEqual([[1], [2], [3]])
  })

  it("throws if the chunk size is zero or negative", () => {
    expect(() => chunkEvery([1, 2, 3], 0)).toThrow()
    expect(() => chunkEvery([1, 2, 3], -1)).toThrow()
  })
})

describe("findValue", () => {
  it("returns the square of the first number greater than 2", () => {
    expect(findValue([2, 3, 4], (x) => (x > 2 ? x * x : undefined))).toEqual(9)
  })

  it("returns undefined since no number is greater than 4", () => {
    expect(findValue([2, 3, 4], (x) => (x > 4 ? x * x : undefined))).toBeUndefined()
  })

  it("handles empty arrays", () => {
    expect(findValue([], (x) => (x > 2 ? x * x : undefined))).toBeUndefined()
  })

  const users = [
    { id: 1, name: "Alice" },
    { id: 2, name: "Bob" },
    { id: 3, name: "Charlie" },
  ]

  it("returns the name of id=2", () => {
    expect(findValue(users, (u) => (u.id == 2 ? u.name : undefined))).toEqual("Bob")
  })

  it("returns undefined when no object matches", () => {
    expect(findValue(users, (u) => (u.id == 4 ? u.name : undefined))).toBeUndefined()
  })
})

describe("shuffleArray", () => {
  it("returns a new array with the same elements in a different order", () => {
    const arr = [1, 2, 3, 4, 5]
    const result = shuffleArray(arr)
    expect(result).toHaveLength(arr.length) // same length
    expect([...result].sort()).toEqual([...arr].sort()) // same elements
  })
})

describe("uniq", () => {
  it("removes duplicate primitive values and preserves insertion order", () => {
    expect(uniq([1, 2, 3, 2, 1, 4])).toEqual([1, 2, 3, 4])
    expect(uniq(["a", "b", "a", "c"])).toEqual(["a", "b", "c"])
  })

  it("returns an empty array when input is empty", () => {
    expect(uniq([])).toEqual([])
  })

  it("treats distinct object references as unique", () => {
    const a = { x: 1 }
    const b = { x: 1 }
    expect(uniq([a, a, b])).toEqual([a, b])
  })
})

describe("uniqBy", () => {
  it("removes elements based on key length and preserves first occurrence", () => {
    expect(uniqBy(["cat", "dog", "raccoon", "meow", "woof"], (x) => x.length)).toEqual(["cat", "raccoon", "meow"])
  })

  it("returns an empty array when input is empty", () => {
    expect(uniqBy([], (x) => x)).toEqual([])
  })

  it("removes elements that only differ in case and preserves the first occurence", () => {
    expect(uniqBy(["cat", "CAT", "DOG", "dog", "raccoon", "RACCOON"], (x) => x.toLowerCase())).toEqual([
      "cat",
      "DOG",
      "raccoon",
    ])
  })
})
