import { useEffect, useState } from "react"

/** Viewport information. */
export type ViewportInfo = {
  /** Viewport height in CSS pixels */
  height?: number
  /** >= 1280px = desktop / landscape (iPad Pro 12.9") */
  lg?: boolean
  /** >= 1024px = laptop / landscape table (iPad Mini 5th gen / iPad) */
  md?: boolean
  /** < 724px = mobile phones, typically >=375px */
  mobile?: boolean
  /** >=724px = portrait tablet / landscape phone (iPhone 13 Mini / iPhone 11 Pro + safe area)*/
  sm?: boolean
  /** Viewport width in CSS pixels */
  width?: number
  /** >= 1536px = huge desktop / 4K */
  xl?: boolean
}

/**
 * Returns the current viewport's size as `width` and `height` in CSS pixels and breakpoint booleans.
 *
 * This hook listens for window `resize` events. Using `useIsMobile` or `useMediaQuery` when checking
 * breakpoints is recommended for performance reasons, as they only fire out boundary changes.
 *
 * @returns viewport details
 *
 * @example
 * Get viewport dimensions on resize.
 * ```tsx
 * import { useViewport } from "@trashpanda001/helpers/hooks"
 *
 * function Component() {
 *   const { width, height } = useViewport()
 *   return <div>Width: {width}, Height: {height}</div>
 * }
 * ```
 */
export function useViewport() {
  const [info, setInfo] = useState<ViewportInfo>({})
  useEffect(() => {
    function handleResize() {
      const width = window.innerWidth
      const height = window.innerHeight
      setInfo({
        height,
        lg: width >= 1280,
        md: width >= 1024,
        mobile: width < 724,
        sm: width >= 724,
        width,
        xl: width >= 1536,
      })
    }
    window.addEventListener("resize", handleResize, { passive: true })
    handleResize()
    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [])
  return info
}
