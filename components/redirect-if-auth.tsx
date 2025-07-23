"use client"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

export function RedirectIfAuth({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    const user = typeof window !== "undefined" ? localStorage.getItem("user") : null
    if (user) {
      try {
        const parsed = JSON.parse(user)
        if (parsed.isAuthenticated) {
          router.replace("/dashboard")
          return
        }
      } catch {}
    }
    setChecking(false)
  }, [router])

  if (checking) return null
  return <>{children}</>
}