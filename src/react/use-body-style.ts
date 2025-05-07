import { styleToString, type CSSProperties } from "@trashpanda001/helpers/string"
import { useEffect } from "react"

/**
 * Sets body element style. Merges with existing styling and restores original styling on unmount.
 *
 * @param styleObject - a React / JSON style object with camelCase keys
 *
 * @example
 * ```tsx
 * import { useBodyStyle } from "@trashpanda001/helpers/react"
 *
 * function Component() {
 *   useBodyStyle({ backgroundColor: "red", color: "white" })
 *   return <div>...</div>
 * }
 * ```
 */
export function useBodyStyle(styleObject: CSSProperties) {
  const style = styleToString(styleObject)
  useEffect(() => {
    const original = document.body.style.cssText
    document.body.style.cssText = original + style
    return () => {
      document.body.style.cssText = original
    }
  }, [style])
}
