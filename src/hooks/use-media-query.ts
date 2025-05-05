import { useEffect, useState } from "react"

/**
 * Monitor changes in media query state.
 *
 * @param query media query
 * @returns true if media query matches, false otherwise
 */
export function useMediaQuery(query: string) {
  const [value, setValue] = useState(false)

  useEffect(() => {
    function onChange(event: MediaQueryListEvent) {
      setValue(event.matches)
    }
    const result = matchMedia(query)
    result.addEventListener("change", onChange, { passive: true })
    setValue(result.matches)
    return () => {
      result.removeEventListener("change", onChange)
    }
  }, [query])

  return value
}
