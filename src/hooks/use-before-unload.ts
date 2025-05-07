import { useEffect, useRef } from "react"

/**
 * Registers a `beforeunload` event listener that invokes the given callback.
 *
 * The callback can invoke `event.preventDefault()` and set `event.returnValue` to a string
 *
 * @param callback - callback handler
 * @param enabled - whether to register the event listener
 *
 * @example
 * Prompt the user before leaving the page.
 * ```tsx
 * import { useBeforeUnload } from "@trashpanda001/helpers/hooks"
 *
 * function Component() {
 *   useBeforeUnload((event) => {
 *     event.preventDefault()
 *     event.returnValue = "Are you sure you want to leave?"
 *   })
 *   return <div>Page</div>
 * }
 * ```
 */
export function useBeforeUnload(callback: (event: BeforeUnloadEvent) => void, enabled: boolean = true) {
  const callbackRef = useRef(callback)
  callbackRef.current = callback

  useEffect(() => {
    if (!enabled) {
      return
    }
    function handleBeforeUnload(event: BeforeUnloadEvent) {
      callbackRef.current?.(event)
    }
    window.addEventListener("beforeunload", handleBeforeUnload, { passive: false })
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload)
    }
  }, [enabled])
}
