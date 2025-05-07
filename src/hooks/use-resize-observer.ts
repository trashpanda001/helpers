import { useEffect, useState } from "react"

/**
 * Monitor the size of an element ref.
 *
 * https://developer.mozilla.org/en-US/docs/Web/API/DOMRectReadOnly
 *
 * @param ref - element ref
 * @returns size and position of a rectangle
 *
 * @example
 * ```tsx
 * import { useResizeObserver } from "@trashpanda001/helpers/hooks"
 * import { useRef } from "react"
 *
 * function Component() {
 *   const ref = useRef<HTMLDivElement>(null)
 *   const rect = useResizeObserver(ref)
 *   console.log(rect)
 *   return <div ref={ref} style={{ width: "100px", height: "100px" }} />
 * }
 * ```
 */
export function useResizeObserver(ref: React.RefObject<HTMLElement | null>) {
  const [rect, setRect] = useState<DOMRectReadOnly>(new DOMRectReadOnly())
  useEffect(() => {
    const element = ref.current
    if (!element) {
      throw new Error("useResizeObserver: ref is not set")
    }
    const observer = new ResizeObserver((entries) => setRect(entries[0]!.contentRect))
    observer.observe(element)
    return () => {
      observer.unobserve(element)
    }
  }, [ref])
  return rect
}
