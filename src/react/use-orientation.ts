import { useMediaQuery } from "./use-media-query.js"

/**
 * Determine current device orientation.
 *
 * @returns the current orientation
 *
 * @example
 * Check if the device is in portrait mode.
 * ```tsx
 * import { useOrientation } from "@trashpanda001/helpers/react"
 *
 * function Component() {
 *   const orientation = useOrientation()
 *   return <div>{orientation}</div>
 * }
 * ```
 */
export function useOrientation() {
  return useMediaQuery("(orientation:portrait)") ? "portrait" : "landscape"
}
