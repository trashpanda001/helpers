import { chunkEvery, findValue, groupBy, shuffleArray, sortBy, times, uniq, uniqBy } from "@trashpanda001/helpers/array"
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

describe("groupBy", () => {
  it("groups numbers by their floored value", () => {
    const arr = [6.1, 4.2, 6.3]
    expect(groupBy(arr, Math.floor)).toEqual({ "4": [4.2], "6": [6.1, 6.3] })
  })

  it("groups strings by their length", () => {
    const arr = ["one", "two", "three", "four", "five"]
    expect(groupBy(arr, (x) => x.length)).toEqual({
      "3": ["one", "two"],
      "4": ["four", "five"],
      "5": ["three"],
    })
  })

  it("returns an empty object when input is empty", () => {
    expect(groupBy([], (x) => x)).toEqual({})
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

describe("sortBy", () => {
  it("sorts numbers ascending by absolute value", () => {
    const arr = [-3, -1, 2]
    const result = sortBy(
      arr,
      (x) => Math.abs(x),
      (a, b) => a - b,
    )
    expect(result).toEqual([-1, 2, -3])
  })

  it("sorts numbers descending by absolute value", () => {
    const arr = [-9, 7, 8]
    const result = sortBy(
      arr,
      (x) => Math.abs(x),
      (a, b) => b - a,
    )
    expect(result).toEqual([-9, 8, 7])
  })

  it("sorts objects by a key and preserves stability", () => {
    const arr = [
      { group: "a", id: 1 },
      { group: "b", id: 2 },
      { group: "a", id: 3 },
      { group: "b", id: 4 },
    ]
    // sort by group (a before b), maintain original order for same group
    const result = sortBy(
      arr,
      (x) => x.group,
      (a, b) => a.localeCompare(b),
    )
    expect(result).toEqual([
      { group: "a", id: 1 },
      { group: "a", id: 3 },
      { group: "b", id: 2 },
      { group: "b", id: 4 },
    ])
  })
})

describe("times", () => {
  it("returns an array of the specified length filled with the result of the mapper function", () => {
    const result = times(3, (i) => i * 2)
    expect(result).toEqual([0, 2, 4])
  })

  it("returns an array of the specified length filled with the default value when no mapper is provided", () => {
    const result = times(3)
    expect(result).toEqual([0, 1, 2])
  })

  it("returns an empty array when n is zero", () => {
    const result = times(0)
    expect(result).toEqual([])
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
