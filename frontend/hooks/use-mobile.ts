"use client"

import { useState, useEffect } from "react"

export const useMobile = () => {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768) // Adjust breakpoint as needed
    }

    // Set initial value
    handleResize()

    // Add event listener
    window.addEventListener("resize", handleResize)

    // Clean up event listener
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  return isMobile
}
