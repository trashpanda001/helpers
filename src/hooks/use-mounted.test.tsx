import { render, screen } from "@testing-library/react"
import { useMounted } from "@trashpanda001/helpers/hooks"
import { renderToString } from "react-dom/server"
import { describe, expect, it } from "vitest"

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
