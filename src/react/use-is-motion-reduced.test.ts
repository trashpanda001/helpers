import { act, renderHook } from "@testing-library/react"
import { useIsMotionReduced } from "@trashpanda001/helpers/react"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

describe("useIsMotionReduced hook", () => {
  let listeners: Set<(e: MediaQueryListEvent) => void>

  beforeEach(() => {
    listeners = new Set()
    vi.stubGlobal(
      "matchMedia",
      (query: string) =>
        ({
          addEventListener: (_: string, cb: (e: MediaQueryListEvent) => void) => {
            listeners.add(cb)
          },
          matches: false,
          media: query,
          removeEventListener: (_: string, cb: (e: MediaQueryListEvent) => void) => {
            listeners.delete(cb)
          },
        }) as MediaQueryList,
    )
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it("returns true by default (when motion is not preferred)", () => {
    const { result } = renderHook(() => useIsMotionReduced())
    expect(result.current).toBe(true)
  })

  it("updates value on preference change events", () => {
    const { result } = renderHook(() => useIsMotionReduced())
    expect(result.current).toBe(true)

    // When prefers-reduced-motion:no-preference matches (user wants normal motion)
    act(() => {
      listeners.forEach((cb) => cb({ matches: true } as MediaQueryListEvent))
    })
    expect(result.current).toBe(false)

    // When prefers-reduced-motion:no-preference doesn't match (user wants reduced motion)
    act(() => {
      listeners.forEach((cb) => cb({ matches: false } as MediaQueryListEvent))
    })
    expect(result.current).toBe(true)
  })

  it("removes event listener on unmount", () => {
    const { result, unmount } = renderHook(() => useIsMotionReduced())

    act(() => {
      listeners.forEach((cb) => cb({ matches: true } as MediaQueryListEvent))
    })
    expect(result.current).toBe(false)

    unmount()

    act(() => {
      listeners.forEach((cb) => cb({ matches: false } as MediaQueryListEvent))
    })
    expect(result.current).toBe(false)
    expect(listeners.size).toBe(0)
  })
})
