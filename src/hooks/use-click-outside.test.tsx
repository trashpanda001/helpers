import { renderHook } from "@testing-library/react"
import { useClickOutside } from "@trashpanda001/helpers/hooks"
import { describe, expect, it, vi } from "vitest"

describe("useClickOutside", () => {
  it("should call the callback when a click occurs outside the element", () => {
    const callback = vi.fn()
    const div = document.createElement("div")
    document.body.appendChild(div)
    const { result } = renderHook(() => useClickOutside(callback))
    Object.defineProperty(result.current, "current", { value: div })

    const outsideClickEvent = new MouseEvent("click", {
      bubbles: true,
      cancelable: true,
    })
    document.body.dispatchEvent(outsideClickEvent)

    expect(callback).toHaveBeenCalledTimes(1)
    expect(callback).toHaveBeenCalledWith(outsideClickEvent)
    document.body.removeChild(div)
  })

  it("should not call the callback when a click occurs inside the element", () => {
    const callback = vi.fn()
    const div = document.createElement("div")
    document.body.appendChild(div)
    const { result } = renderHook(() => useClickOutside(callback))
    Object.defineProperty(result.current, "current", { value: div })

    const insideClickEvent = new MouseEvent("click", {
      bubbles: true,
      cancelable: true,
    })
    div.dispatchEvent(insideClickEvent)

    expect(callback).not.toHaveBeenCalled()
    document.body.removeChild(div)
  })

  it("should remove the event listener when component unmounts", () => {
    const removeEventListenerSpy = vi.spyOn(document, "removeEventListener")
    const { unmount } = renderHook(() => useClickOutside(() => {}))
    unmount()
    expect(removeEventListenerSpy).toHaveBeenCalled()
  })
})
