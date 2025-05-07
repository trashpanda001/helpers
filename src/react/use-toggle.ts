import { useReducer } from "react"

/**
 * A simple `useState` wrapper that toggles between true/false (on/off).
 *
 * @param initialState - initial state
 * @returns an array of toggle state and toggle function
 *
 * @example
 * Toggle state and toggler function.
 * ```tsx
 * import { useToggle } from "@trashpanda001/helpers/react"
 *
 * function Component() {
 *   const [show, toggle] = useToggle(false)
 *   return <button onClick={toggle}>Toggle {show ? "off" : "on"}</button>
 * }
 * ```
 */
export function useToggle(initialState: boolean) {
  return useReducer((previous: boolean) => !previous, initialState)
}
