import { useEffect, useState } from "react"

/**
 * Monitor changes in media query state.
 *
 * @param query - media query
 * @returns true if media query matches, false otherwise
 *
 * @example
 * Check if the screen is at a mobile breakpoint.
 * ```tsx
 * import { useMediaQuery } from "@trashpanda001/helpers/react"
 *
 * function Component() {
 *   const isMobile = useMediaQuery("(max-width: 600px)")
 *   return <div>{isMobile ? "Mobile" : "Desktop"}</div>
 * }
 * ```
 */
export function useMediaQuery(query: string) {
  const [value, setValue] = useState(false)

  useEffect(() => {
    const controller = new AbortController()
    const result = matchMedia(query)
    result.addEventListener("change", (event) => setValue(event.matches), {
      passive: true,
      signal: controller.signal,
    })
    setValue(result.matches)
    return () => controller.abort()
  }, [query])

  return value
}
