import { act, renderHook } from "@testing-library/react"
import { useResizeObserver } from "@trashpanda001/helpers/react"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

describe("useResizeObserver", () => {
  let OriginalRO: typeof ResizeObserver
  let observe: ReturnType<typeof vi.fn>
  let unobserve: ReturnType<typeof vi.fn>
  let callback: ResizeObserverCallback

  beforeEach(() => {
    OriginalRO = window.ResizeObserver

    observe = vi.fn()
    unobserve = vi.fn()

    class ROStub {
      disconnect = vi.fn()
      observe = observe
      unobserve = unobserve
      constructor(cb: ResizeObserverCallback) {
        callback = cb
      }
    }

    window.ResizeObserver = ROStub as unknown as typeof ResizeObserver
  })

  afterEach(() => {
    window.ResizeObserver = OriginalRO
    vi.restoreAllMocks()
  })

  it("throws if ref is not set", () => {
    expect(() => {
      renderHook(() => useResizeObserver({ current: null }))
    }).toThrow("useResizeObserver: ref is not set")
  })

  it("observes on mount and unobserves on unmount", () => {
    const ref = { current: document.createElement("div") }
    const { unmount } = renderHook(() => useResizeObserver(ref))

    expect(observe).toHaveBeenCalledWith(ref.current)

    unmount()
    expect(unobserve).toHaveBeenCalledWith(ref.current)
  })

  it("updates rect when element size changes", () => {
    const ref = { current: document.createElement("div") }
    const { result } = renderHook(() => useResizeObserver(ref))

    expect(result.current.width).toBe(0)
    expect(result.current.height).toBe(0)

    act(() => {
      callback(
        [
          {
            contentRect: new DOMRectReadOnly(0, 0, 200, 150),
          } as unknown as ResizeObserverEntry,
        ] as unknown as ResizeObserverEntry[],
        {} as unknown as ResizeObserver,
      )
    })

    expect(result.current.width).toBe(200)
    expect(result.current.height).toBe(150)
  })
})
