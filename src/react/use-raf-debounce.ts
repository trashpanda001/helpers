import { useCallback, useRef } from "react"

/**
 * Debounces a callback using requestAnimationFrame to sync with display refresh rate.
 *
 * This is ideal for high-frequency events like scroll, resize, or mousemove that need
 * to update the UI. Instead of running on every event (which can be 1000+ times/sec),
 * the callback runs at the display refresh rate (60fps/120fps).
 *
 * @param callback - Function to debounce
 * @returns Debounced function that runs at display refresh rate
 *
 * @example
 * ```tsx
 * const debouncedScroll = useRafDebounce(() => {
 *   updateScrollPosition()
 * })
 *
 * window.addEventListener('scroll', debouncedScroll, { passive: true })
 * window.removeEventListener('scroll', debouncedScroll)
 * ```
 */
export function useRafDebounce<T extends unknown[]>(callback: (...args: T) => void): (...args: T) => void {
  const handleRef = useRef(0)
  return useCallback(
    (...args: T) => {
      cancelAnimationFrame(handleRef.current)
      handleRef.current = requestAnimationFrame((_time: DOMHighResTimeStamp) => {
        callback(...args)
      })
    },
    [callback],
  )
}
