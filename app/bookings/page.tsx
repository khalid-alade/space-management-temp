"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, MapPin, Download, Search, Filter } from "lucide-react"
import { toast } from "@/components/ui/use-toast"

interface User {
  id: string
  firstName: string
  lastName: string
  email: string
  isAuthenticated: boolean
}

interface Booking {
  id: string
  type: "coworking" | "event"
  spaceName: string
  date: string
  duration: number
  amount: number
  status: "confirmed" | "pending" | "completed" | "cancelled"
  description?: string
}

export default function BookingsPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")

  // Mock bookings data
  const [bookings] = useState<Booking[]>([
    {
      id: "BK001",
      type: "coworking",
      spaceName: "Flex Pass",
      date: "2024-01-15",
      duration: 30,
      amount: 50000,
      status: "confirmed",
      description: "Monthly coworking membership",
    },
    {
      id: "BK002",
      type: "event",
      spaceName: "Conference Hall",
      date: "2024-01-20",
      duration: 4,
      amount: 100000,
      status: "completed",
      description: "Product launch event",
    },
    {
      id: "BK003",
      type: "coworking",
      spaceName: "Day Pass",
      date: "2024-01-25",
      duration: 1,
      amount: 5000,
      status: "pending",
      description: "Single day access",
    },
    {
      id: "BK004",
      type: "event",
      spaceName: "Training Room",
      date: "2024-02-01",
      duration: 6,
      amount: 90000,
      status: "confirmed",
      description: "Team workshop",
    },
    {
      id: "BK005",
      type: "coworking",
      spaceName: "Dedicated Office",
      date: "2024-02-05",
      duration: 30,
      amount: 150000,
      status: "cancelled",
      description: "Private office space",
    },
  ])

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (userData) {
      const parsedUser = JSON.parse(userData)
      if (parsedUser.isAuthenticated) {
        setUser(parsedUser)
      } else {
        router.push("/login")
      }
    } else {
      router.push("/login")
    }
    setIsLoading(false)
  }, [router])

  const downloadReceipt = (bookingId: string) => {
    // In a real app, this would generate and download a PDF
    toast({
      title: "Receipt Downloaded",
      description: `Receipt for booking ${bookingId} has been downloaded as PDF.`,
    })
  }

  const filteredBookings = bookings.filter((booking) => {
    const matchesSearch =
      booking.spaceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.id.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || booking.status === statusFilter
    const matchesType = typeFilter === "all" || booking.type === typeFilter

    return matchesSearch && matchesStatus && matchesType
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "default"
      case "completed":
        return "secondary"
      case "pending":
        return "outline"
      case "cancelled":
        return "destructive"
      default:
        return "outline"
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/4"></div>
          <div className="grid gap-4">
            {Array(3)
              .fill(0)
              .map((_, i) => (
                <div key={i} className="h-32 bg-muted rounded"></div>
              ))}
          </div>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="container mx-auto px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">My Bookings</h1>
        <p className="text-muted-foreground">Manage your space bookings and download receipts</p>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filter Bookings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search bookings..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 transition-all duration-200 focus:scale-[1.02]"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="transition-all duration-200 focus:scale-[1.02]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="transition-all duration-200 focus:scale-[1.02]">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="coworking">Coworking</SelectItem>
                <SelectItem value="event">Event Space</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Bookings List */}
      <div className="space-y-4">
        {filteredBookings.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Calendar className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-medium mb-2">No bookings found</h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm || statusFilter !== "all" || typeFilter !== "all"
                  ? "Try adjusting your filters to see more results."
                  : "You haven't made any bookings yet."}
              </p>
              <Button asChild>
                <a href="/coworking">Make Your First Booking</a>
              </Button>
            </CardContent>
          </Card>
        ) : (
          filteredBookings.map((booking) => (
            <Card key={booking.id} className="transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-primary/10 rounded-full">
                      {booking.type === "coworking" ? (
                        <MapPin className="h-6 w-6 text-primary" />
                      ) : (
                        <Calendar className="h-6 w-6 text-primary" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{booking.spaceName}</h3>
                      <p className="text-sm text-muted-foreground mb-1">Booking ID: {booking.id}</p>
                      <p className="text-sm text-muted-foreground mb-1">
                        {new Date(booking.date).toLocaleDateString("en-US", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                      <p className="text-sm text-muted-foreground mb-2">
                        Duration: {booking.duration} {booking.type === "coworking" ? "days" : "hours"}
                      </p>
                      {booking.description && (
                        <p className="text-sm text-muted-foreground italic">{booking.description}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className="text-xl font-bold">₦{booking.amount.toLocaleString()}</p>
                      <Badge variant={getStatusColor(booking.status) as any} className="mt-2">
                        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                      </Badge>
                    </div>
                    {booking.status !== "cancelled" && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => downloadReceipt(booking.id)}
                        className="transition-all duration-200 hover:scale-105"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Receipt
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Summary Stats */}
      {filteredBookings.length > 0 && (
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Booking Summary</CardTitle>
            <CardDescription>Overview of your filtered bookings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-4">
              <div className="text-center p-4 border rounded-lg">
                <p className="text-2xl font-bold">{filteredBookings.length}</p>
                <p className="text-sm text-muted-foreground">Total Bookings</p>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <p className="text-2xl font-bold">
                  ₦{filteredBookings.reduce((sum, booking) => sum + booking.amount, 0).toLocaleString()}
                </p>
                <p className="text-sm text-muted-foreground">Total Amount</p>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <p className="text-2xl font-bold">{filteredBookings.filter((b) => b.type === "coworking").length}</p>
                <p className="text-sm text-muted-foreground">Coworking Bookings</p>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <p className="text-2xl font-bold">{filteredBookings.filter((b) => b.type === "event").length}</p>
                <p className="text-sm text-muted-foreground">Event Bookings</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
