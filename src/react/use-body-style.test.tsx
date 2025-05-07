import { renderHook } from "@testing-library/react"
import { useBodyStyle } from "@trashpanda001/helpers/react"
import { afterEach, beforeEach, describe, expect, it } from "vitest"

describe("useBodyStyle", () => {
  let originalBodyStyle: string

  beforeEach(() => {
    originalBodyStyle = document.body.style.cssText
    document.body.style.cssText = ""
  })

  afterEach(() => {
    document.body.style.cssText = originalBodyStyle
  })

  it("applies styles to body element", () => {
    const { unmount } = renderHook(() => useBodyStyle({ backgroundColor: "red", color: "white" }))

    expect(document.body.style.backgroundColor).toBe("red")
    expect(document.body.style.color).toBe("white")

    unmount()

    expect(document.body.style.backgroundColor).toBe("")
    expect(document.body.style.color).toBe("")
  })

  it("preserves existing styles", () => {
    document.body.style.fontSize = "16px"

    const { unmount } = renderHook(() => useBodyStyle({ backgroundColor: "blue", margin: "10px" }))

    expect(document.body.style.backgroundColor).toBe("blue")
    expect(document.body.style.margin).toBe("10px")
    expect(document.body.style.fontSize).toBe("16px")

    unmount()

    expect(document.body.style.backgroundColor).toBe("")
    expect(document.body.style.margin).toBe("")
    expect(document.body.style.fontSize).toBe("16px")
  })

  it("updates styles when dependencies change", () => {
    const { rerender, unmount } = renderHook(({ styleObj }) => useBodyStyle(styleObj), {
      initialProps: { styleObj: { backgroundColor: "green", padding: "20px" } },
    })

    expect(document.body.style.backgroundColor).toBe("green")
    expect(document.body.style.padding).toBe("20px")

    rerender({ styleObj: { backgroundColor: "yellow", padding: "30px" } })

    expect(document.body.style.backgroundColor).toBe("yellow")
    expect(document.body.style.padding).toBe("30px")

    unmount()

    expect(document.body.style.backgroundColor).toBe("")
    expect(document.body.style.padding).toBe("")
  })

  it("restores original styles on unmount", () => {
    document.body.style.cssText = "color: black; font-size: 14px;"

    const { unmount } = renderHook(() => useBodyStyle({ backgroundColor: "purple", color: "orange" }))

    expect(document.body.style.backgroundColor).toBe("purple")
    expect(document.body.style.color).toBe("orange")
    expect(document.body.style.fontSize).toBe("14px")

    unmount()

    expect(document.body.style.backgroundColor).toBe("")
    expect(document.body.style.color).toBe("black")
    expect(document.body.style.fontSize).toBe("14px")
  })
})
