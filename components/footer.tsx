"use client"
import Link from "next/link"
import { Facebook, Instagram, Linkedin, Twitter } from "lucide-react"
import { useState, useEffect } from "react"

interface AppUser {
  id: string
  firstName: string
  lastName: string
  email: string
  isAuthenticated: boolean
}


export default function Footer() {
const [user, setUser] = useState<AppUser | null>(null)
useEffect(() => {
    const userData = localStorage.getItem("user")
    if (userData) {
      const parsedUser = JSON.parse(userData)
      if (parsedUser.isAuthenticated) {
        setUser(parsedUser)
      }
    }
  }, [])

  return (
    <footer className="border-t bg-background">
      <div className="container px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="space-y-4">
            <Link href={user ? "/dashboard" : "/"} className="flex items-center space-x-2">
              <div className="flex items-start justify-start">
                <img src="https://res.cloudinary.com/dw3ublxm7/image/upload/f_auto,q_auto,c_fill,g_auto/v1743093874/twnegwbridcqompdoteo.png"
                  className="max-w-28 invert sepia-0 saturate-0 contrast-100 dark:invert-0 dark:sepia-0 dark:saturate-100 dark:contrast-100"
                  alt="Nithub logo" />
              </div>
            </Link>
            <p className="text-sm text-muted-foreground">
              Nigeria's premier tech innovation hub providing coworking spaces and event venues for tech enthusiasts and
              professionals.
            </p>
            <div className="flex space-x-4">
              <Link href="https://www.facebook.com/profile.php?id=61555262481803" target="_blank" className="text-muted-foreground hover:text-primary">
                <Facebook className="h-5 w-5" />
                <span className="sr-only">Facebook</span>
              </Link>
              <Link href="https://x.com/nithub_lag?s=21" target="_blank" className="text-muted-foreground hover:text-primary">
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </Link>
              <Link href="https://www.instagram.com/nithub_unilag?igsh=MWN2cGZ2MTljYzl3ZQ%3D%3D&utm_source=qr" target="_blank" className="text-muted-foreground hover:text-primary">
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </Link>
              <Link href="https://www.linkedin.com/company/nithub/" target="_blank" className="text-muted-foreground hover:text-primary">
                <Linkedin className="h-5 w-5" />
                <span className="sr-only">LinkedIn</span>
              </Link>
            </div>
          </div>
          <div className="space-y-4">
            <h3 className="text-sm font-medium">Spaces</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/coworking" className="text-muted-foreground hover:text-primary">
                  Coworking Spaces
                </Link>
              </li>
              <li>
                <Link href="/event-spaces" className="text-muted-foreground hover:text-primary">
                  Event Venues
                </Link>
              </li>
              <li>
                <Link href="/virtual-office" className="text-muted-foreground hover:text-primary">
                  Virtual Office
                </Link>
              </li>
              <li>
                <Link href="/meeting-rooms" className="text-muted-foreground hover:text-primary">
                  Meeting Rooms
                </Link>
              </li>
            </ul>
          </div>
          <div className="space-y-4">
            <h3 className="text-sm font-medium">Company</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" target="_blank" className="text-muted-foreground hover:text-primary">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="mailto:info-nitdahub@unilag.edu.ng" className="text-muted-foreground hover:text-primary">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/careers" className="text-muted-foreground hover:text-primary">
                  Careers
                </Link>
              </li>
              <li>
                <Link href="https://nithub.unilag.edu.ng/blog" target="_blank" className="text-muted-foreground hover:text-primary">
                  Blog
                </Link>
              </li>
            </ul>
          </div>
          <div className="space-y-4">
            <h3 className="text-sm font-medium">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/terms" className="text-muted-foreground hover:text-primary">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-muted-foreground hover:text-primary">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/cookies" className="text-muted-foreground hover:text-primary">
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-12 border-t pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Nithub. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
