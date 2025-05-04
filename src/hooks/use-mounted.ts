import { useEffect, useState } from "react"

/**
 * Returns `true` after component has mounted on the client.
 *
 * @returns true when mounted on client
 */
export function useMounted() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    setMounted(true)
  }, [])
  return mounted
}
