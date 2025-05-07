import { act, renderHook } from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { useIsMobile } from "./use-is-mobile.js"

describe("useIsMobile hook", () => {
  let listeners: Set<(e: MediaQueryListEvent) => void>
  const MOBILE_BREAKPOINT = 724 // this should match the value in use-is-mobile.ts

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

  it("returns false by default (not mobile)", () => {
    const { result } = renderHook(() => useIsMobile())
    expect(result.current).toBe(false)
  })

  it("uses the correct mobile breakpoint in media query", () => {
    let capturedQuery = ""
    vi.stubGlobal("matchMedia", (query: string) => {
      capturedQuery = query
      return {
        addEventListener: (_: string, _cb: (e: MediaQueryListEvent) => void) => {},
        addListener: () => {},
        dispatchEvent: () => true,
        matches: false,
        media: query,
        onchange: null,
        removeEventListener: (_: string, _cb: (e: MediaQueryListEvent) => void) => {},
        removeListener: () => {},
      } as unknown as MediaQueryList
    })

    renderHook(() => useIsMobile())
    expect(capturedQuery).toBe(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
  })

  it("updates value on media query change events", () => {
    const { result } = renderHook(() => useIsMobile())
    expect(result.current).toBe(false)

    // Simulate switching to mobile viewport
    act(() => {
      listeners.forEach((cb) => cb({ matches: true } as MediaQueryListEvent))
    })
    expect(result.current).toBe(true)

    // Simulate switching back to desktop viewport
    act(() => {
      listeners.forEach((cb) => cb({ matches: false } as MediaQueryListEvent))
    })
    expect(result.current).toBe(false)
  })

  it("removes event listener on unmount", () => {
    const { unmount } = renderHook(() => useIsMobile())
    const listenersSizeBefore = listeners.size
    expect(listenersSizeBefore).toBeGreaterThan(0)

    unmount()

    expect(listeners.size).toBe(0)
  })
})
