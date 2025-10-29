import { act, renderHook } from "@testing-library/react"
import { useRafDebounce } from "@trashpanda001/helpers/react"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

describe("useRafDebounce", () => {
  let rafCallbacks: Map<number, FrameRequestCallback>
  let cancelledHandles: number[]
  let nextHandle: number

  beforeEach(() => {
    nextHandle = 1
    rafCallbacks = new Map()
    cancelledHandles = []

    const stubbedRequestAnimationFrame: typeof requestAnimationFrame = (callback) => {
      const handle = nextHandle++
      rafCallbacks.set(handle, callback)
      return handle
    }

    const stubbedCancelAnimationFrame: typeof cancelAnimationFrame = (handle) => {
      cancelledHandles.push(handle)
      rafCallbacks.delete(handle)
    }

    vi.stubGlobal("requestAnimationFrame", stubbedRequestAnimationFrame)
    vi.stubGlobal("cancelAnimationFrame", stubbedCancelAnimationFrame)
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it("only executes the latest invocation on the next animation frame", () => {
    const callback = vi.fn<(value: string) => void>()
    const { result } = renderHook(() => useRafDebounce(callback))

    act(() => {
      result.current("first")
    })

    const handlesAfterFirst = [...rafCallbacks.keys()]
    expect(handlesAfterFirst).toHaveLength(1)
    const firstHandle = handlesAfterFirst[0]!

    act(() => {
      result.current("second")
    })

    const handles = [...rafCallbacks.keys()]
    expect(handles).toHaveLength(1)
    const latestHandle = handles[0]!

    expect(cancelledHandles).toContain(firstHandle)
    expect(callback).not.toHaveBeenCalled()

    act(() => {
      const frame = rafCallbacks.get(latestHandle)
      expect(frame).toBeDefined()
      frame?.(16 as DOMHighResTimeStamp)
    })

    expect(callback).toHaveBeenCalledTimes(1)
    expect(callback).toHaveBeenCalledWith("second")
  })
})
