"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { LogOut, BarChart3, Shield, Settings, Menu } from "lucide-react"
import { ModeToggle } from "@/components/mode-toggle"
import { toast } from "@/components/ui/use-toast"
import { useAdminAuth } from "@/hooks/use-admin-auth"

const publicRoutes = [
  {
    href: "/",
    label: "Home",
  },
  {
    href: "/coworking",
    label: "Coworking",
  },
  {
    href: "/event-spaces",
    label: "Event Spaces",
  },
  {
    href: "/about",
    label: "About",
  },
]

const authenticatedRoutes = [
  {
    href: "/dashboard",
    label: "Dashboard",
  },
  {
    href: "/bookings",
    label: "My Bookings",
  },
]

interface AppUser {
  id: string
  firstName: string
  lastName: string
  email: string
  isAuthenticated: boolean
}

export default function Header() {
  const pathname = usePathname()
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [user, setUser] = useState<AppUser | null>(null)
  const { admin, logout: adminLogout } = useAdminAuth()

  // useEffect(() => {
  //   const userData = localStorage.getItem("user")
  //   if (userData) {
  //     const parsedUser = JSON.parse(userData)
  //     if (parsedUser.isAuthenticated) {
  //       setUser(parsedUser)
  //     }
  //   }
  // }, [])






useEffect(() => {
  const updateUser = () => {
    const userData = localStorage.getItem("user")
    if (userData) {
      const parsedUser = JSON.parse(userData)
      if (parsedUser.isAuthenticated) {
        setUser(parsedUser)
      } else {
        setUser(null)
      }
    } else {
      setUser(null)
    }
  }

  updateUser() // Initial check

  window.addEventListener("userChanged", updateUser)
  window.addEventListener("storage", updateUser)

  return () => {
    window.removeEventListener("userChanged", updateUser)
    window.removeEventListener("storage", updateUser)
  }
}, [])






  const handleLogout = () => {
    localStorage.removeItem("user")
    setUser(null)
    window.dispatchEvent(new Event("userChanged"));

    toast({
      title: "Signed out successfully",
      description: "You have been signed out of your account.",
    })
    router.push("/")
  }

  const handleAdminLogout = () => {
    adminLogout()
    router.push("/")
  }

  // const routes = user ? [...publicRoutes, ...authenticatedRoutes] : publicRoutes
  const routes = user ? authenticatedRoutes : publicRoutes

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4 sm:px-8">
        <div className="flex items-center gap-6 md:gap-10">
          <Link href={user ? "/dashboard" : "/"} className="flex items-center">
            <div className="w-28 h-14">
                <img src="https://res.cloudinary.com/dw3ublxm7/image/upload/f_auto,q_auto,c_fill,g_auto/v1743093874/twnegwbridcqompdoteo.png"
                className="invert sepia-0 saturate-0 contrast-100 dark:invert-0 dark:sepia-0 dark:saturate-100 dark:contrast-100"
                alt="Nithub logo" />
              </div>
          </Link>
          <NavigationMenu className="hidden md:flex">
            <NavigationMenuList>
              {routes.map((route) => (
                <NavigationMenuItem key={route.href}>
                  <Link href={route.href} legacyBehavior passHref>
                    <NavigationMenuLink
                      className={cn(
                        navigationMenuTriggerStyle(),
                        pathname === route.href && "text-primary font-medium",
                        "transition-colors duration-200",
                      )}
                    >
                      {route.label}
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        <div className="flex items-center gap-2">
          <ModeToggle />

          {/* Admin Access */}
          {admin ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-8 w-8 rounded-full transition-all duration-200 hover:scale-110"
                >
                  <div className="p-2 bg-primary/10 rounded-full">
                    <Shield className="h-4 w-4 text-primary" />
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <div className="flex items-center justify-start gap-2 p-2">
                  <div className="flex flex-col space-y-1 leading-none">
                    <p className="font-medium">{admin.name}</p>
                    <p className="w-[200px] truncate text-sm text-muted-foreground">{admin.email}</p>
                    <p className="text-xs text-muted-foreground">
                      {admin.role === "super" ? "Super Admin" : "Regular Admin"}
                    </p>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/admin/dashboard" className="cursor-pointer">
                    <BarChart3 className="mr-2 h-4 w-4" />
                    Admin Dashboard
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleAdminLogout} className="cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link href="/admin/login">
              <Button variant="ghost" size="sm" className="hidden md:flex">
                <Shield className="mr-2 h-4 w-4" />
                Admin
              </Button>
            </Link>
          )}

          {/* User Account */}
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-8 w-8 rounded-full transition-all duration-200 hover:scale-110"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {user.firstName.charAt(0)}
                      {user.lastName.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <div className="flex items-center justify-start gap-2 p-2">
                  <div className="flex flex-col space-y-1 leading-none">
                    <p className="font-medium">
                      {user.firstName} {user.lastName}
                    </p>
                    <p className="w-[200px] truncate text-sm text-muted-foreground">{user.email}</p>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/dashboard" className="cursor-pointer">
                    <BarChart3 className="mr-2 h-4 w-4" />
                    Dashboard
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/settings" className="cursor-pointer">
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Link href="/login" className="hidden md:block">
                <Button variant="outline" size="sm" className="transition-all duration-200 hover:scale-105">
                  Sign In
                </Button>
              </Link>
              <Link href="/register" className="hidden md:block">
                <Button size="sm" className="transition-all duration-200 hover:scale-105">
                  Sign Up
                </Button>
              </Link>
            </>
          )}

          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon" className="transition-all duration-200 hover:scale-110">
                {/* <Avatar className="h-5 w-5" /> */}
                {/* what is Avatar */}
                {/* <span className="sr-only">Toggle menu</span> */}
                <Menu />
                {/* <p className="text-red-800">Toggle menu</p> */}
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="pr-0">
              <div className="flex flex-col gap-4 px-2">
                {routes.map((route) => (
                  <Link
                    key={route.href}
                    href={route.href}
                    className={cn(
                      "text-lg font-medium transition-colors hover:text-primary",
                      pathname === route.href && "text-primary",
                    )}
                    onClick={() => setIsOpen(false)}
                  >
                    {route.label}
                  </Link>
                ))}

                {user ? (
                  <div className="flex flex-col gap-2 mt-4 pt-4 border-t">
                    <div className="flex items-center gap-2 mb-2">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-primary text-primary-foreground">
                          {user.firstName.charAt(0)}
                          {user.lastName.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-sm">
                          {user.firstName} {user.lastName}
                        </p>
                        <p className="text-xs text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                    <Link href="/dashboard" onClick={() => setIsOpen(false)}>
                      <Button variant="outline" className="w-full justify-start">
                        <Avatar className="mr-2 h-4 w-4" />
                        Dashboard
                      </Button>
                    </Link>
                    <Button variant="outline" className="w-full justify-start" onClick={handleLogout}>
                      <Avatar className="mr-2 h-4 w-4" />
                      Sign out
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2 mt-4">
                    <Link href="/login" onClick={() => setIsOpen(false)}>
                      <Button variant="outline" className="w-full">
                        Sign In
                      </Button>
                    </Link>
                    <Link href="/register" onClick={() => setIsOpen(false)}>
                      <Button className="w-full">Sign Up</Button>
                    </Link>
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
