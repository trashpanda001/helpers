import { useReducer } from "react"

/**
 * Returns a function that can be invoked to force an update / re-render.
 *
 * @returns stable force update function
 *
 * @example
 * Force a component to re-render.
 * ```tsx
 * import { useForceUpdate } from "@trashpanda001/helpers/hooks"
 *
 * function Component() {
 *   const forceUpdate = useForceUpdate()
 *   return <button onClick={forceUpdate}>Refresh</button>
 * }
 * ```
 */
export const useForceUpdate = () => useReducer((x) => x + 1, 0)[1]
