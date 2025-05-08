import { useMediaQuery } from "./use-media-query.js"

/**
 * Determine if current device is in landscape orientation.
 *
 * @returns true if landscape, false if portrait
 *
 * @example
 * Check if the device is in landscape mode.
 * ```tsx
 * import { useIsLandscape } from "@trashpanda001/helpers/react"
 *
 * function Component() {
 *   const isLandscape = useIsLandscape()
 *   return <div>{isLandscape ? "landscape" : "portrait"}</div>
 * }
 * ```
 */
export function useIsLandscape() {
  return useMediaQuery("(orientation:landscape)")
}
