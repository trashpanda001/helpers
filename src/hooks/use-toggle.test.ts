import { act, renderHook } from "@testing-library/react"
import { useToggle } from "@trashpanda001/helpers/hooks"
import { describe, expect, it } from "vitest"

describe("useToggle", () => {
  it("initializes and toggles on each call", () => {
    const { result } = renderHook(() => useToggle(false))
    const [value, toggle] = result.current
    expect(value).toBe(false)
    act(() => {
      toggle()
    })
    expect(result.current[0]).toBe(true)
    act(() => {
      toggle()
    })
    expect(result.current[0]).toBe(false)
  })

  it("can start true", () => {
    const { result } = renderHook(() => useToggle(true))
    expect(result.current[0]).toBe(true)
  })
})
