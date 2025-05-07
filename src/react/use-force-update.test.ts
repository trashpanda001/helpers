import { act, renderHook } from "@testing-library/react"
import { useForceUpdate } from "@trashpanda001/helpers/react"
import { useRef } from "react"
import { describe, expect, it } from "vitest"

describe("useForceUpdate hook", () => {
  it("re-renders component when forceUpdate is called", () => {
    const { result } = renderHook(() => {
      const forceUpdate = useForceUpdate()
      const renders = useRef(0)
      renders.current++
      return { forceUpdate, renders: renders.current }
    })

    expect(result.current.renders).toBe(1)

    act(() => {
      result.current.forceUpdate()
    })

    expect(result.current.renders).toBe(2)
  })
})
