"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, Download, MapPin, TrendingUp, Users, Clock, DollarSign, Activity, BarChart3 } from "lucide-react"
import Link from "next/link"
import { toast } from "@/components/ui/use-toast"
import { CalendarSync } from "@/components/calendar-sync"

interface User {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  joinDate: string
  isAuthenticated: boolean
}

interface Booking {
  id: string
  type: "coworking" | "event"
  spaceName: string
  date: string
  duration: number
  amount: number
  status: "confirmed" | "pending" | "completed"
}

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Mock data for dashboard
  const [bookings] = useState<Booking[]>([
    {
      id: "BK001",
      type: "coworking",
      spaceName: "Flex Pass",
      date: "2024-01-15",
      duration: 30,
      amount: 50000,
      status: "confirmed",
    },
    {
      id: "BK002",
      type: "event",
      spaceName: "Conference Hall",
      date: "2024-01-20",
      duration: 4,
      amount: 100000,
      status: "completed",
    },
    {
      id: "BK003",
      type: "coworking",
      spaceName: "Day Pass",
      date: "2024-01-25",
      duration: 1,
      amount: 5000,
      status: "pending",
    },
  ])

  const stats = {
    totalBookings: bookings.length,
    totalSpent: bookings.reduce((sum, booking) => sum + booking.amount, 0),
    hoursUsed: 156,
    eventsHosted: bookings.filter((b) => b.type === "event").length,
  }

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
      description: `Receipt for booking ${bookingId} has been downloaded.`,
    })
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/4"></div>
          <div className="grid gap-4 md:grid-cols-4">
            {Array(4)
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
        <h1 className="text-3xl font-bold">Welcome back, {user.firstName}!</h1>
        <p className="text-muted-foreground">Here's what's happening with your Nithub account</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card className="transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalBookings}</div>
            <p className="text-xs text-muted-foreground">+2 from last month</p>
          </CardContent>
        </Card>

        <Card className="transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₦{stats.totalSpent.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">+15% from last month</p>
          </CardContent>
        </Card>

        <Card className="transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Hours Used</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.hoursUsed}</div>
            <p className="text-xs text-muted-foreground">+8 hours this week</p>
          </CardContent>
        </Card>

        <Card className="transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Events Hosted</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.eventsHosted}</div>
            <p className="text-xs text-muted-foreground">+1 from last month</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        {/* <TabsList className="grid w-full grid-cols-4"> */}
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview" className="hover:bg-[#d8f0f8e6] text-[16px] font-semibold">Overview</TabsTrigger>
          {/* <TabsTrigger value="bookings" className="hover:bg-[#d8f0f8e6] text-[16px] font-semibold">Bookings</TabsTrigger> */}
          {/* <TabsTrigger value="analytics">Analytics</TabsTrigger> */}
          <TabsTrigger value="calendar" className="hover:bg-[#d8f0f8e6] text-[16px] font-semibold">Calendar</TabsTrigger>
          {/* <TabsTrigger value="profile" className="hover:bg-[#d8f0f8e6] text-[16px] font-semibold">Profile</TabsTrigger> */}
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Book spaces and manage your account</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Link href="/coworking/book">
                  {/* <Button className="w-full justify-start transition-all duration-200 hover:scale-[1.02]"> */}
                  <Button className="w-full justify-start transition-all duration-200 hover:scale-[1.02] bg-[#7ba8df] hover:bg-[#6093d1]">
                    <MapPin className="mr-2 h-4 w-4" />
                    Book Coworking Space
                  </Button>
                </Link>
                <Link href="/event-spaces/book">
                  <Button
                    variant="outline"
                    className="w-full justify-start transition-all duration-200 hover:scale-[1.02]"
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    Book Event Space
                  </Button>
                </Link>
                <Link href="/bookings">
                  <Button
                    variant="outline"
                    className="w-full justify-start transition-all duration-200 hover:scale-[1.02]"
                  >
                    <Activity className="mr-2 h-4 w-4" />
                    View All Bookings
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Usage This Month</CardTitle>
                <CardDescription>Your workspace activity</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Coworking Hours</span>
                    <span>120/160 hours</span>
                  </div>
                  <Progress value={75} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Event Bookings</span>
                    <span>2/5 bookings</span>
                  </div>
                  <Progress value={40} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Monthly Budget</span>
                    <span>₦85,000/₦100,000</span>
                  </div>
                  <Progress value={85} className="h-2" />
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Your latest bookings and transactions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {bookings.slice(0, 3).map((booking) => (
                  <div
                    key={booking.id}
                    className="flex items-center justify-between p-4 border rounded-lg transition-all duration-200 hover:shadow-md"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="p-2 bg-primary/10 rounded-full">
                        {booking.type === "coworking" ? (
                          <MapPin className="h-4 w-4 text-primary" />
                        ) : (
                          <Calendar className="h-4 w-4 text-primary" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium">{booking.spaceName}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(booking.date).toLocaleDateString()} • {booking.duration}{" "}
                          {booking.type === "coworking" ? "days" : "hours"}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">₦{booking.amount.toLocaleString()}</p>
                      <Badge
                        variant={
                          booking.status === "confirmed"
                            ? "default"
                            : booking.status === "completed"
                              ? "secondary"
                              : "outline"
                        }
                      >
                        {booking.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bookings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>All Bookings</CardTitle>
              <CardDescription>Manage your space bookings and download receipts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {bookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="flex items-center justify-between p-4 border rounded-lg transition-all duration-200 hover:shadow-md"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="p-2 bg-primary/10 rounded-full">
                        {booking.type === "coworking" ? (
                          <MapPin className="h-4 w-4 text-primary" />
                        ) : (
                          <Calendar className="h-4 w-4 text-primary" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium">{booking.spaceName}</p>
                        <p className="text-sm text-muted-foreground">Booking ID: {booking.id}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(booking.date).toLocaleDateString()} • {booking.duration}{" "}
                          {booking.type === "coworking" ? "days" : "hours"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <p className="font-medium">₦{booking.amount.toLocaleString()}</p>
                        <Badge
                          variant={
                            booking.status === "confirmed"
                              ? "default"
                              : booking.status === "completed"
                                ? "secondary"
                                : "outline"
                          }
                        >
                          {booking.status}
                        </Badge>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => downloadReceipt(booking.id)}
                        className="transition-all duration-200 hover:scale-105"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Receipt
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* <TabsContent value="analytics" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Spending Trends</CardTitle>
                <CardDescription>Your monthly spending on workspace bookings</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">January 2024</span>
                    <span className="font-medium">₦155,000</span>
                  </div>
                  <Progress value={85} className="h-2" />
                  <div className="flex items-center justify-between">
                    <span className="text-sm">December 2023</span>
                    <span className="font-medium">₦120,000</span>
                  </div>
                  <Progress value={65} className="h-2" />
                  <div className="flex items-center justify-between">
                    <span className="text-sm">November 2023</span>
                    <span className="font-medium">₦95,000</span>
                  </div>
                  <Progress value={50} className="h-2" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Usage Patterns</CardTitle>
                <CardDescription>How you use Nithub spaces</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-primary rounded-full"></div>
                      <span className="text-sm">Coworking</span>
                    </div>
                    <span className="font-medium">75%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-secondary rounded-full"></div>
                      <span className="text-sm">Event Spaces</span>
                    </div>
                    <span className="font-medium">25%</span>
                  </div>
                  <div className="mt-4 p-4 bg-muted rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <TrendingUp className="h-4 w-4 text-green-500" />
                      <span className="text-sm font-medium">Peak Usage</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      You're most active on Tuesdays and Thursdays between 9 AM - 5 PM
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Productivity Insights</CardTitle>
              <CardDescription>Data-driven insights about your workspace usage</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="p-4 border rounded-lg text-center">
                  <BarChart3 className="h-8 w-8 mx-auto mb-2 text-primary" />
                  <p className="font-medium">Average Session</p>
                  <p className="text-2xl font-bold">6.5 hours</p>
                  <p className="text-sm text-muted-foreground">+0.5h from last month</p>
                </div>
                <div className="p-4 border rounded-lg text-center">
                  <Calendar className="h-8 w-8 mx-auto mb-2 text-secondary" />
                  <p className="font-medium">Monthly Visits</p>
                  <p className="text-2xl font-bold">18 days</p>
                  <p className="text-sm text-muted-foreground">+2 days from last month</p>
                </div>
                <div className="p-4 border rounded-lg text-center">
                  <Users className="h-8 w-8 mx-auto mb-2 text-primary" />
                  <p className="font-medium">Network Connections</p>
                  <p className="text-2xl font-bold">24 people</p>
                  <p className="text-sm text-muted-foreground">+6 new connections</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent> */}

        <TabsContent value="calendar" className="space-y-4">
          <CalendarSync />
        </TabsContent>

        <TabsContent value="profile" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Manage your account details and preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="text-sm font-medium">First Name</label>
                  <p className="text-muted-foreground">{user.firstName}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Last Name</label>
                  <p className="text-muted-foreground">{user.lastName}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Email</label>
                  <p className="text-muted-foreground">{user.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Phone</label>
                  <p className="text-muted-foreground">{user.phone}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Member Since</label>
                  <p className="text-muted-foreground">{new Date(user.joinDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <label className="text-sm font-medium inline-block mr-2">Membership Status</label>
                  <Badge className="mt-1">Active Member</Badge>
                </div>
              </div>
              <div className="pt-4">
                <Button className="transition-all duration-200 hover:scale-[1.02]">Edit Profile</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
