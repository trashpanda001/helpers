import { render } from "@testing-library/react"
import { useBeforeUnload } from "@trashpanda001/helpers/react"
import { describe, expect, it, vi } from "vitest"

function Component({ callback, enabled = true }: { callback: (e: Event) => void; enabled?: boolean }) {
  useBeforeUnload(callback as (e: BeforeUnloadEvent) => void, enabled)
  return null
}

describe("useBeforeUnload", () => {
  it("invokes callback on beforeunload event", () => {
    const callback = vi.fn()
    render(<Component callback={callback} />)
    const event = new Event("beforeunload", { cancelable: true })
    window.dispatchEvent(event)
    expect(callback).toHaveBeenCalledWith(event)
  })

  it("does not invoke callback when disabled", () => {
    const callback = vi.fn()
    render(<Component callback={callback} enabled={false} />)
    const event = new Event("beforeunload", { cancelable: true })
    window.dispatchEvent(event)
    expect(callback).not.toHaveBeenCalled()
  })

  it("removes event listener on unmount", () => {
    const callback = vi.fn()
    const { unmount } = render(<Component callback={callback} />)
    unmount()
    const event = new Event("beforeunload", { cancelable: true })
    window.dispatchEvent(event)
    expect(callback).not.toHaveBeenCalled()
  })
})
