import { act, render, renderHook, screen } from "@testing-library/react"
import { useResizeObserver } from "@trashpanda001/helpers/hooks"
import { useRef } from "react"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

// Mock implementation of ResizeObserver
class MockResizeObserver {
  callback: ResizeObserverCallback
  elements: Set<Element>
  constructor(callback: ResizeObserverCallback) {
    this.callback = callback
    this.elements = new Set()
  }
  disconnect() {
    this.elements.clear()
  }
  observe(element: Element) {
    this.elements.add(element)
  }
  triggerResize(element: Element, rect: DOMRectReadOnly) {
    this.callback(
      [
        {
          contentRect: rect,
          target: element,
        } as ResizeObserverEntry,
      ],
      this,
    )
  }
  unobserve(element: Element) {
    this.elements.delete(element)
  }
}

function TestComponent() {
  const ref = useRef<HTMLDivElement>(null)
  const rect = useResizeObserver(ref)

  return (
    <div>
      <div data-testid="resizable-element" ref={ref} style={{ height: "100px", width: "100px" }} />
      <div data-testid="rect-info">
        Width: {rect.width}, Height: {rect.height}
      </div>
    </div>
  )
}

describe("useResizeObserver", () => {
  let originalResizeObserver: typeof ResizeObserver
  let mockObserver: MockResizeObserver

  beforeEach(() => {
    originalResizeObserver = window.ResizeObserver
    mockObserver = new MockResizeObserver(() => {})
    window.ResizeObserver = vi.fn().mockImplementation((callback) => {
      mockObserver = new MockResizeObserver(callback)
      return mockObserver
    })
  })

  afterEach(() => {
    window.ResizeObserver = originalResizeObserver
  })

  it("initializes with empty DOMRectReadOnly", () => {
    const { result } = renderHook(() => {
      const ref = { current: document.createElement("div") }
      return useResizeObserver(ref)
    })

    expect(result.current.width).toBe(0)
    expect(result.current.height).toBe(0)
  })

  it("throws an error if ref is not set", () => {
    expect(() => {
      renderHook(() => {
        const ref = { current: null }
        return useResizeObserver(ref)
      })
    }).toThrow("useResizeObserver: ref is not set")
  })

  it("observes the referenced element", () => {
    const spyObserve = vi.spyOn(MockResizeObserver.prototype, "observe")

    renderHook(() => {
      const ref = { current: document.createElement("div") }
      return useResizeObserver(ref)
    })

    expect(spyObserve).toHaveBeenCalledTimes(1)
  })

  it("unobserves the element on unmount", () => {
    const spyUnobserve = vi.spyOn(MockResizeObserver.prototype, "unobserve")

    const { unmount } = renderHook(() => {
      const ref = { current: document.createElement("div") }
      return useResizeObserver(ref)
    })

    unmount()
    expect(spyUnobserve).toHaveBeenCalledTimes(1)
  })

  it("updates rect when element size changes", async () => {
    render(<TestComponent />)

    const element = screen.getByTestId("resizable-element")

    act(() => {
      mockObserver.triggerResize(element, new DOMRectReadOnly(0, 0, 200, 150))
    })

    expect(screen.getByTestId("rect-info").textContent).toBe("Width: 200, Height: 150")
  })
})
