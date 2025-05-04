import { useReducer } from "react"

/**
 * Returns a function that can be invoked to force an update / re-render.
 *
 * @returns stable force update function
 */
export const useForceUpdate = () => useReducer((x) => x + 1, 0)[1]
