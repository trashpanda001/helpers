import { render, screen, waitFor } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { useMounted } from "./use-mounted.js"

function TestComponent() {
  const mounted = useMounted()
  return <div data-testid="mounted">{mounted.toString()}</div>
}

describe("useMounted", () => {
  it("renders a boolean string", () => {
    render(<TestComponent />)
    const el = screen.getByTestId("mounted")
    expect(["true", "false"]).toContain(el.textContent)
  })

  it("returns true after mount", async () => {
    render(<TestComponent />)
    await waitFor(() => {
      expect(screen.getByTestId("mounted").textContent).toBe("true")
    })
  })
})
