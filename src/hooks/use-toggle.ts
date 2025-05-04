import { useReducer } from "react"

/**
 * A simple `useState` wrapper that toggles between true/false (on/off).
 *
 * @param initialState initial state
 * @returns an array of toggle state and toggle function
 */
export function useToggle(initialState: boolean) {
  return useReducer((previous: boolean) => !previous, initialState)
}
