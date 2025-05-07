import { useEffect, useRef } from "react"

/**
 * A hook that executes a onClickOutside if a click occurs outside attached element ref.
 *
 * @param onClickOutside - callback handler
 * @returns ref to attach to DOM element
 *
 * @example
 * Listen for clicks outside of an element.
 * ```tsx
 * import { useClickOutside } from "@trashpanda001/helpers/react"
 *
 * function Component() {
 *   const ref = useClickOutside((event) => {
 *     console.log("Clicked outside of element", event)
 *   })
 *   return <div ref={ref}>Click outside of this element</div>
 * }
 * ```
 */
export function useClickOutside<T extends HTMLElement = HTMLElement>(onClickOutside: (event: MouseEvent) => void) {
  const elementRef = useRef<T>(null)
  const callbackRef = useRef(onClickOutside)
  callbackRef.current = onClickOutside

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (elementRef.current && !elementRef.current.contains(event.target as Node)) {
        callbackRef.current(event)
      }
    }
    document.addEventListener("click", handleClickOutside, { capture: true, passive: true })
    return () => {
      document.removeEventListener("click", handleClickOutside, { capture: true })
    }
  }, [])

  return elementRef
}
