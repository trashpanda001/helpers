import { useMediaQuery } from "@trashpanda001/helpers/hooks"

const MOBILE_BREAKPOINT = 724 // shadcn-ui uses 768

export function useIsMobile() {
  return useMediaQuery(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
}
