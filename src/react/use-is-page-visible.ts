import { useEffect, useState } from "react"

/**
 * Monitors changes in page visibility state.
 *
 * https://developer.mozilla.org/en-US/docs/Web/API/Page_Visibility_API
 *
 * @returns true if visible, false if hidden
 *
 * @example
 * Check if the page is visible.
 * ```tsx
 * import { useIsPageVisible } from "@trashpanda001/helpers/react"
 *
 * function Component() {
 *   const isVisible = useIsPageVisible()
 *   return <div>{isVisible ? "Visible" : "Hidden"}</div>
 * }
 * ```
 */
export function useIsPageVisible() {
  const [visibilityState, setVisibilityState] = useState("visible")
  useEffect(() => {
    const handler = () => setVisibilityState(document.visibilityState)
    window.addEventListener("visibilitychange", handler, { passive: true })
    return () => {
      window.removeEventListener("visibilitychange", handler)
    }
  }, [])
  return visibilityState == "visible"
}
