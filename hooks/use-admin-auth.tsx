"use client"

import type React from "react"

import { useState, useEffect, createContext, useContext } from "react"
import { useRouter } from "next/navigation"

// Define admin types
type AdminRole = "regular" | "super"

interface Admin {
  id: string
  name: string
  email: string
  role: AdminRole
}

// Mock admin data
const mockAdmins = [
  {
    id: "1",
    name: "Admin User",
    email: "admin@nithub.com",
    password: "admin123", // In a real app, this would be hashed
    role: "super" as AdminRole,
  },
  {
    id: "2",
    name: "Staff User",
    email: "staff@nithub.com",
    password: "staff123", // In a real app, this would be hashed
    role: "regular" as AdminRole,
  },
]

interface AdminAuthContextType {
  admin: Admin | null
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  isLoading: boolean
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined)

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [admin, setAdmin] = useState<Admin | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Check if user is logged in from localStorage
    const storedAdmin = localStorage.getItem("admin")
    if (storedAdmin) {
      try {
        setAdmin(JSON.parse(storedAdmin))
      } catch (error) {
        console.error("Failed to parse admin data:", error)
        localStorage.removeItem("admin")
      }
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true)

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Find admin with matching credentials
    const foundAdmin = mockAdmins.find((a) => a.email.toLowerCase() === email.toLowerCase() && a.password === password)

    if (foundAdmin) {
      // Create admin object without password
      const { password: _, ...adminData } = foundAdmin
      setAdmin(adminData)
      localStorage.setItem("admin", JSON.stringify(adminData))
      setIsLoading(false)
      return true
    }

    setIsLoading(false)
    return false
  }

  const logout = () => {
    setAdmin(null)
    localStorage.removeItem("admin")
  }

  return <AdminAuthContext.Provider value={{ admin, login, logout, isLoading }}>{children}</AdminAuthContext.Provider>
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext)
  if (context === undefined) {
    throw new Error("useAdminAuth must be used within an AdminAuthProvider")
  }
  return context
}
