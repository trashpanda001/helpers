import { useEffect, useRef, useState } from "react"

/**
 * This hook sets `isHovered` if its `ref` is hovered. The `ref` should be attached to the element
 * you're interested in. An optional onHover can be passed that is invoked on/off hover.
 *
 * @param onHover - optional callback (first argument is true if hovered)
 * @returns object with `ref` and `isHovered` properties
 *
 * @example
 * Listen for hover events on an element.
 * ```tsx
 * import { useHover } from "@trashpanda001/helpers/react"
 *
 * function Component() {
 *   const { ref, isHovered } = useHover((hovered) => {
 *     console.log(`Callback received ${hovered}`)
 *   })
 *   return <div ref={ref}>{isHovered ? "Hovering" : "Not hovering"} over this element.</div>
 * }
 * ```
 */
export function useHover<T extends HTMLElement = HTMLElement>(onHover?: (hovered: boolean) => void) {
  const ref = useRef<T>(null)
  const callbackRef = useRef(onHover)
  callbackRef.current = onHover
  const [isHovered, setIsHovered] = useState(false)

  useEffect(() => {
    const element = ref.current
    if (!element) {
      console.warn("useHover: ref is not set. Make sure to attach the ref to an element.")
      return
    }
    function handlePointerEnter() {
      callbackRef.current?.(true)
      setIsHovered(true)
    }
    function handlePointerLeave() {
      callbackRef.current?.(false)
      setIsHovered(false)
    }
    element.addEventListener("pointerenter", handlePointerEnter, { passive: true })
    element.addEventListener("pointerleave", handlePointerLeave, { passive: true })
    return () => {
      element.removeEventListener("pointerenter", handlePointerEnter)
      element.removeEventListener("pointerleave", handlePointerLeave)
    }
  }, [])
  return { isHovered, ref }
}
