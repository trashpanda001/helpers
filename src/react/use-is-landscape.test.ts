import { act, renderHook } from "@testing-library/react"
import { useIsLandscape } from "@trashpanda001/helpers/react"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

describe("useIsLandscape hook", () => {
  let listeners: Set<(e: MediaQueryListEvent) => void>

  beforeEach(() => {
    listeners = new Set()
    vi.stubGlobal(
      "matchMedia",
      (query: string) =>
        ({
          addEventListener: (_: string, cb: (e: MediaQueryListEvent) => void, options?: AddEventListenerOptions) => {
            listeners.add(cb)
            if (options?.signal instanceof AbortSignal) {
              options.signal.addEventListener("abort", () => {
                listeners.delete(cb)
              })
            }
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
    const { result } = renderHook(() => useIsLandscape())
    expect(result.current).toBe(false)
  })

  it("updates value on orientation change events", () => {
    const { result } = renderHook(() => useIsLandscape())
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
    const { result, unmount } = renderHook(() => useIsLandscape())

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
