import { identity, noop, sleep } from "@trashpanda001/helpers/functions"
import { describe, expect, it, vi } from "vitest"

describe("identity", () => {
  it("returns the first argument", () => {
    expect(identity(123)).toBe(123)
    expect(identity("abc")).toBe("abc")
    expect(identity(true)).toBe(true)
    expect(identity({})).toEqual({})
    expect(identity([])).toEqual([])
  })
})

describe("noop", () => {
  it("does nothing and returns undefined", () => {
    expect(noop()).toBeUndefined()
    expect(noop(1, "a", {})).toBeUndefined()
  })
})

describe("sleep", () => {
  it("resolves after the specified delay", async () => {
    vi.useFakeTimers()

    let resolved = false
    const promise = sleep(1000)
    promise.then(() => {
      resolved = true
    })

    vi.advanceTimersByTime(999)
    await Promise.resolve()
    expect(resolved).toBe(false)

    vi.advanceTimersByTime(1)
    await promise
    expect(resolved).toBe(true)
    vi.useRealTimers()
  })

  it("resolves immediately when delay is zero", async () => {
    await expect(sleep(0)).resolves.toBeUndefined()
  })
})
