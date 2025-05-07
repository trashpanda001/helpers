import { fireEvent, render, screen } from "@testing-library/react"
import { useHover } from "@trashpanda001/helpers/react"
import { describe, expect, it, vi } from "vitest"

function TestComponent({ onHover = (_hovered: boolean) => {} }) {
  const { isHovered, ref } = useHover<HTMLDivElement>(onHover)
  return (
    <div data-testid="hover-element" ref={ref}>
      {isHovered ? "Hovered" : "Not Hovered"}
    </div>
  )
}

describe("useHover", () => {
  it("should initialize with isHovered as false", () => {
    render(<TestComponent />)
    const element = screen.getByTestId("hover-element")
    expect(element.textContent).toBe("Not Hovered")
  })

  it("should set isHovered to true on pointerenter and call callback with true", () => {
    const callback = vi.fn()
    render(<TestComponent onHover={callback} />)
    const element = screen.getByTestId("hover-element")

    // Simulate pointer enter event
    fireEvent.pointerEnter(element)

    // Check if isHovered is true and callback was called with true
    expect(element.textContent).toBe("Hovered")
    expect(callback).toHaveBeenCalledWith(true)
  })

  it("should set isHovered to false on pointerleave and call callback with false", () => {
    const callback = vi.fn()
    render(<TestComponent onHover={callback} />)
    const element = screen.getByTestId("hover-element")

    // First enter, then leave
    fireEvent.pointerEnter(element)
    fireEvent.pointerLeave(element)

    // Check if isHovered is false and callback was called with false
    expect(element.textContent).toBe("Not Hovered")
    expect(callback).toHaveBeenCalledWith(false)
  })

  it("should work without a callback", () => {
    render(<TestComponent />)
    const element = screen.getByTestId("hover-element")

    // Simulate pointer enter event
    fireEvent.pointerEnter(element)
    expect(element.textContent).toBe("Hovered")

    // Simulate pointer leave event
    fireEvent.pointerLeave(element)
    expect(element.textContent).toBe("Not Hovered")
  })
})
