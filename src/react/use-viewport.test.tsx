import { act, renderHook } from "@testing-library/react"
import { useViewport } from "@trashpanda001/helpers/react"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

describe("useViewport hook", () => {
  const originalInnerWidth = window.innerWidth
  const originalInnerHeight = window.innerHeight
  let resizeListeners: Array<EventListener> = []

  beforeEach(() => {
    resizeListeners = []
    Object.defineProperty(window, "innerWidth", { configurable: true, value: 1024, writable: true })
    Object.defineProperty(window, "innerHeight", { configurable: true, value: 768, writable: true })
    vi.spyOn(window, "addEventListener").mockImplementation((event, listener, _options) => {
      if (event == "resize") {
        resizeListeners.push(listener as EventListener)
      }
    })
    vi.spyOn(window, "removeEventListener").mockImplementation((event, listener) => {
      if (event == "resize") {
        resizeListeners = resizeListeners.filter((l) => l !== listener)
      }
    })
  })

  afterEach(() => {
    Object.defineProperty(window, "innerWidth", { value: originalInnerWidth })
    Object.defineProperty(window, "innerHeight", { value: originalInnerHeight })
  })

  it("returns initial viewport information on mount", () => {
    const { result } = renderHook(() => useViewport())
    expect(result.current).toEqual({
      height: 768,
      lg: false,
      md: true,
      mobile: false,
      sm: true,
      width: 1024,
      xl: false,
    })
  })

  it("updates viewport information on resize", () => {
    const { result } = renderHook(() => useViewport())
    expect(result.current.width).toBe(1024)
    expect(result.current.height).toBe(768)

    act(() => {
      Object.defineProperty(window, "innerWidth", { configurable: true, value: 500, writable: true })
      Object.defineProperty(window, "innerHeight", { configurable: true, value: 800, writable: true })
      resizeListeners.forEach((listener) => listener(new Event("resize")))
    })
    expect(result.current).toEqual({
      height: 800,
      lg: false,
      md: false,
      mobile: true,
      sm: false,
      width: 500,
      xl: false,
    })

    act(() => {
      Object.defineProperty(window, "innerWidth", { configurable: true, value: 1600, writable: true })
      Object.defineProperty(window, "innerHeight", { configurable: true, value: 900, writable: true })
      resizeListeners.forEach((listener) => listener(new Event("resize")))
    })
    expect(result.current).toEqual({
      height: 900,
      lg: true,
      md: true,
      mobile: false,
      sm: true,
      width: 1600,
      xl: true,
    })
  })

  it("cleans up event listeners on unmount", () => {
    const { unmount } = renderHook(() => useViewport())
    expect(resizeListeners.length).toBe(1)
    unmount()
    expect(resizeListeners.length).toBe(0)
  })

  it("correctly identifies all breakpoints", () => {
    const testCases = [
      { expected: { lg: false, md: false, mobile: true, sm: false, xl: false }, width: 500 },
      { expected: { lg: false, md: false, mobile: false, sm: true, xl: false }, width: 724 },
      { expected: { lg: false, md: true, mobile: false, sm: true, xl: false }, width: 1024 },
      { expected: { lg: true, md: true, mobile: false, sm: true, xl: false }, width: 1280 },
      { expected: { lg: true, md: true, mobile: false, sm: true, xl: true }, width: 1536 },
    ]

    const { rerender, result } = renderHook(() => useViewport())

    testCases.forEach(({ expected, width }) => {
      act(() => {
        Object.defineProperty(window, "innerWidth", { configurable: true, value: width, writable: true })
        resizeListeners.forEach((listener) => listener(new Event("resize")))
      })

      rerender()

      expect(result.current.mobile).toBe(expected.mobile)
      expect(result.current.sm).toBe(expected.sm)
      expect(result.current.md).toBe(expected.md)
      expect(result.current.lg).toBe(expected.lg)
      expect(result.current.xl).toBe(expected.xl)
    })
  })
})
