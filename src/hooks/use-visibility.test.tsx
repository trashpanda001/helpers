import { act, renderHook } from "@testing-library/react"
import { afterEach, describe, expect, it } from "vitest"
import { useVisibility } from "./use-visibility.js"

describe("useVisibility hook", () => {
  afterEach(() => {
    Object.defineProperty(document, "visibilityState", { configurable: true, value: "visible" })
  })

  it("returns true by default", () => {
    const { result } = renderHook(() => useVisibility())
    expect(result.current).toBe(true)
  })

  it("changes to false when hidden, then back to true for visible", () => {
    const { result } = renderHook(() => useVisibility())
    expect(result.current).toBe(true)

    act(() => {
      Object.defineProperty(document, "visibilityState", { configurable: true, value: "hidden" })
      window.dispatchEvent(new Event("visibilitychange"))
    })
    expect(result.current).toBe(false)

    act(() => {
      Object.defineProperty(document, "visibilityState", { configurable: true, value: "visible" })
      window.dispatchEvent(new Event("visibilitychange"))
    })
    expect(result.current).toBe(true)
  })
})
