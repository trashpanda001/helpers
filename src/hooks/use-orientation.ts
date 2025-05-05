import { useMediaQuery } from "./use-media-query.js"

/**
 * Determine current device orientation.
 *
 * @returns the current orientation
 */
export function useOrientation() {
  return useMediaQuery("(orientation:portrait)") ? "portrait" : "landscape"
}
