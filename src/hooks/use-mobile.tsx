// src/hooks/use-mobile.tsx
import * as React from "react"

const MOBILE_BREAKPOINT = 768 // Standard md breakpoint

export function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    const checkDevice = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }

    // Initial check
    checkDevice()

    // Listener for window resize
    window.addEventListener("resize", checkDevice)

    // Cleanup listener
    return () => window.removeEventListener("resize", checkDevice)
  }, [])

  // Return false during SSR or initial hydration before window is defined
  return isMobile === undefined ? false : isMobile
}