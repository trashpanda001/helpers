import { useEffect, useState } from "react"

/**
 * Returns `true` after component has mounted on the client.
 *
 * @returns true when mounted on client
 *
 * @example
 * ```tsx
 * import { useMounted } from "@trashpanda001/helpers/hooks"
 *
 * function Component() {
 *   const mounted = useMounted()
 *   return <div>{mounted ? "Mounted" : "Unmounted"}</div>
 * }
 * ```
 */
export function useMounted() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    setMounted(true)
  }, [])
  return mounted
}
