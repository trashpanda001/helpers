import { render, screen } from "@testing-library/react"
import { renderToString } from "react-dom/server"
import { describe, expect, it } from "vitest"
import { useMounted } from "./use-mounted.js"

function TestComponent() {
  const mounted = useMounted()
  return <div data-testid="mounted">{mounted.toString()}</div>
}

describe("useMounted", () => {
  it("renders true after useEffect", () => {
    render(<TestComponent />)
    expect(screen.getByTestId("mounted").textContent).toBe("true")
  })

  it("renders false in SSR / before useEffect", () => {
    const html = renderToString(<TestComponent />)
    expect(html).toBe('<div data-testid="mounted">false</div>')
  })
})
