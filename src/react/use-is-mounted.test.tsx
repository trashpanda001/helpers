import { render, screen } from "@testing-library/react"
import { useIsMounted } from "@trashpanda001/helpers/react"
import { renderToString } from "react-dom/server"
import { describe, expect, it } from "vitest"

function Component() {
  const mounted = useIsMounted()
  return <div data-testid="mounted">{mounted.toString()}</div>
}

describe("useIsMounted", () => {
  it("renders true after useEffect", () => {
    render(<Component />)
    expect(screen.getByTestId("mounted").textContent).toBe("true")
  })

  it("renders false in SSR / before useEffect", () => {
    const html = renderToString(<Component />)
    expect(html).toBe('<div data-testid="mounted">false</div>')
  })
})
