import { act, renderHook } from "@testing-library/react"
import { useOrientation } from "@trashpanda001/helpers/react"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

describe("useOrientation hook", () => {
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

  it("returns 'landscape' by default", () => {
    const { result } = renderHook(() => useOrientation())
    expect(result.current).toBe("landscape")
  })

  it("updates value on orientation change events", () => {
    const { result } = renderHook(() => useOrientation())
    expect(result.current).toBe("landscape")

    act(() => {
      listeners.forEach((cb) => cb({ matches: true } as MediaQueryListEvent))
    })
    expect(result.current).toBe("portrait")

    act(() => {
      listeners.forEach((cb) => cb({ matches: false } as MediaQueryListEvent))
    })
    expect(result.current).toBe("landscape")
  })

  it("removes event listener on unmount", () => {
    const { result, unmount } = renderHook(() => useOrientation())

    act(() => {
      listeners.forEach((cb) => cb({ matches: true } as MediaQueryListEvent))
    })
    expect(result.current).toBe("portrait")

    unmount()

    act(() => {
      listeners.forEach((cb) => cb({ matches: false } as MediaQueryListEvent))
    })
    expect(result.current).toBe("portrait")
    expect(listeners.size).toBe(0)
  })
})
