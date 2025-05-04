import { render } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import { useBeforeUnload } from "./use-before-unload.js"

function TestComponent({ callback, enabled = true }: { callback: (e: Event) => void; enabled?: boolean }) {
  useBeforeUnload(callback as (e: BeforeUnloadEvent) => void, enabled)
  return null
}

describe("useBeforeUnload", () => {
  it("invokes callback on beforeunload event", () => {
    const callback = vi.fn()
    render(<TestComponent callback={callback} />)
    const event = new Event("beforeunload", { cancelable: true })
    window.dispatchEvent(event)
    expect(callback).toHaveBeenCalledWith(event)
  })

  it("does not invoke callback when disabled", () => {
    const callback = vi.fn()
    render(<TestComponent callback={callback} enabled={false} />)
    const event = new Event("beforeunload", { cancelable: true })
    window.dispatchEvent(event)
    expect(callback).not.toHaveBeenCalled()
  })

  it("removes event listener on unmount", () => {
    const callback = vi.fn()
    const { unmount } = render(<TestComponent callback={callback} />)
    unmount()
    const event = new Event("beforeunload", { cancelable: true })
    window.dispatchEvent(event)
    expect(callback).not.toHaveBeenCalled()
  })
})
