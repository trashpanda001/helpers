import { asyncCallback, identity, noop, sleep } from "@trashpanda001/helpers/function"
import { describe, expect, it, vi } from "vitest"

describe("asyncCallback", () => {
  it("returns a cancel function that prevents invocation", () => {
    vi.useFakeTimers()

    const callback = vi.fn()
    const cancel = asyncCallback(callback)

    expect(typeof cancel).toBe("function")

    cancel()
    vi.advanceTimersByTime(1000)
    expect(callback).not.toHaveBeenCalled()
    vi.useRealTimers()
  })

  it("invokes the callback after some delay within defaults", () => {
    vi.useFakeTimers()

    const callback = vi.fn()
    asyncCallback(callback)

    vi.advanceTimersByTime(1000)
    expect(callback).toHaveBeenCalledTimes(1)
    vi.useRealTimers()
  })

  it("schedules with provided min/max range", () => {
    const setTimeoutSpy = vi.spyOn(globalThis, "setTimeout")

    const callback = vi.fn()
    const min = 0
    const max = 1000
    const cancel = asyncCallback(callback, min, max)

    // Ensure we don't actually wait for a real timer
    cancel()

    expect(setTimeoutSpy).toHaveBeenCalled()
    const delayArg = setTimeoutSpy.mock.calls[0]?.[1] as number
    expect(typeof delayArg).toBe("number")
    expect(delayArg).toBeGreaterThanOrEqual(min)
    expect(delayArg).toBeLessThanOrEqual(max)

    setTimeoutSpy.mockRestore()
  })
})

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
