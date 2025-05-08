import { useEffect, useState } from "react"

/**
 * Returns `true` after component has mounted on the client.
 *
 * @returns true when mounted on client
 *
 * @example
 * ```tsx
 * import { useIsMounted } from "@trashpanda001/helpers/react"
 *
 * function Component() {
 *   const isMounted = useIsMounted()
 *   return <div>{isMounted ? "Mounted" : "Unmounted"}</div>
 * }
 * ```
 */
export function useIsMounted() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    setMounted(true)
  }, [])
  return mounted
}
