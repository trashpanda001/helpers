import { act, renderHook } from "@testing-library/react"
import { useMediaQuery } from "@trashpanda001/helpers/hooks"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

describe("useMediaQuery hook", () => {
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

  it("returns false by default", () => {
    const { result } = renderHook(() => useMediaQuery("(min-width: 600px)"))
    expect(result.current).toBe(false)
  })

  it("updates value on media query change events", () => {
    const { result } = renderHook(() => useMediaQuery("(min-width: 600px)"))
    expect(result.current).toBe(false)

    act(() => {
      listeners.forEach((cb) => cb({ matches: true } as MediaQueryListEvent))
    })
    expect(result.current).toBe(true)

    act(() => {
      listeners.forEach((cb) => cb({ matches: false } as MediaQueryListEvent))
    })
    expect(result.current).toBe(false)
  })

  it("removes event listener on unmount", () => {
    const { result, unmount } = renderHook(() => useMediaQuery("(min-width: 600px)"))

    act(() => {
      listeners.forEach((cb) => cb({ matches: true } as MediaQueryListEvent))
    })
    expect(result.current).toBe(true)

    unmount()

    act(() => {
      listeners.forEach((cb) => cb({ matches: false } as MediaQueryListEvent))
    })
    expect(result.current).toBe(true)
    expect(listeners.size).toBe(0)
  })
})
