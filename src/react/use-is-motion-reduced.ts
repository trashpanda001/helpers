import { useMediaQuery } from "./use-media-query.js"

/**
 * Determine if device has requested reduced motion.
 *
 * @returns true if motion should be reduced, false if not
 *
 * @example
 * Check if the device prefers reduced motion.
 * ```tsx
 * import { useIsMotionReduced } from "@trashpanda001/helpers/react"
 *
 * function Component() {
 *   const isReducedMotion = useIsMotionReduced()
 *   return <div>{isReducedMotion ? "reduced motion" : "normal motion"}</div>
 * }
 * ```
 */
export function useIsMotionReduced() {
  const prefersMotion = useMediaQuery("(prefers-reduced-motion:no-preference)")
  return !prefersMotion
}
