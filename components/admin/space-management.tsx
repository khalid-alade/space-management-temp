"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Building,
  Plus,
  Edit,
  Trash2,
  Users,
  DollarSign,
  Calendar,
  MapPin,
  Settings,
  Eye,
  BarChart3,
} from "lucide-react"
import { toast } from "@/components/ui/use-toast"

interface Space {
  id: string
  name: string
  type: "coworking" | "event"
  capacity: number
  pricePerHour?: number
  pricePerDay?: number
  pricePerMonth?: number
  description: string
  amenities: string[]
  status: "active" | "maintenance" | "inactive"
  bookingsThisMonth: number
  revenueThisMonth: number
  utilizationRate: number
  image?: string
}

export function SpaceManagement() {
  const [selectedSpace, setSelectedSpace] = useState<Space | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [isCreating, setIsCreating] = useState(false)

  // Mock space data
  const [spaces, setSpaces] = useState<Space[]>([
    {
      id: "conference-hall",
      name: "Conference Hall",
      type: "event",
      capacity: 100,
      pricePerHour: 25000,
      description: "Our largest space, perfect for conferences, large workshops, and presentations",
      amenities: ["Projector and screen", "Sound system", "Microphones", "Stage", "High-speed internet"],
      status: "active",
      bookingsThisMonth: 15,
      revenueThisMonth: 750000,
      utilizationRate: 78,
    },
    {
      id: "meeting-room",
      name: "Executive Meeting Room",
      type: "event",
      capacity: 12,
      pricePerHour: 8000,
      description: "Professional meeting room for client meetings and team discussions",
      amenities: ["Conference table", "TV screen", "Whiteboard", "Video conferencing", "High-speed internet"],
      status: "active",
      bookingsThisMonth: 25,
      revenueThisMonth: 400000,
      utilizationRate: 65,
    },
    {
      id: "training-room",
      name: "Training Room",
      type: "event",
      capacity: 30,
      pricePerHour: 15000,
      description: "Classroom-style setup ideal for workshops and training sessions",
      amenities: ["Classroom seating", "Projector", "Whiteboards", "Flipcharts", "High-speed internet"],
      status: "maintenance",
      bookingsThisMonth: 8,
      revenueThisMonth: 240000,
      utilizationRate: 45,
    },
    {
      id: "coworking-main",
      name: "Main Coworking Area",
      type: "coworking",
      capacity: 50,
      pricePerDay: 5000,
      pricePerMonth: 50000,
      description: "Open coworking space with flexible seating arrangements",
      amenities: ["Hot desks", "High-speed internet", "Coffee station", "Printing", "Lockers"],
      status: "active",
      bookingsThisMonth: 120,
      revenueThisMonth: 1200000,
      utilizationRate: 85,
    },
    {
      id: "private-offices",
      name: "Private Offices",
      type: "coworking",
      capacity: 20,
      pricePerMonth: 150000,
      description: "Private office spaces for teams and established businesses",
      amenities: ["Dedicated desks", "Meeting room access", "Phone line", "Storage", "24/7 access"],
      status: "active",
      bookingsThisMonth: 8,
      revenueThisMonth: 1200000,
      utilizationRate: 90,
    },
  ])

  const updateSpace = (spaceId: string, updates: Partial<Space>) => {
    setSpaces((prev) => prev.map((space) => (space.id === spaceId ? { ...space, ...updates } : space)))

    toast({
      title: "Space Updated",
      description: "Space information has been successfully updated.",
    })
  }

  const deleteSpace = (spaceId: string) => {
    setSpaces((prev) => prev.filter((space) => space.id !== spaceId))

    toast({
      title: "Space Deleted",
      description: "Space has been removed from the system.",
      variant: "destructive",
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "secondary"
      case "maintenance":
        return "outline"
      case "inactive":
        return "destructive"
      default:
        return "outline"
    }
  }

  const totalSpaces = spaces.length
  const activeSpaces = spaces.filter((s) => s.status === "active").length
  const totalRevenue = spaces.reduce((sum, s) => sum + s.revenueThisMonth, 0)
  const avgUtilization = spaces.reduce((sum, s) => sum + s.utilizationRate, 0) / spaces.length

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Spaces</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalSpaces}</div>
            <p className="text-xs text-muted-foreground">Available spaces</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Spaces</CardTitle>
            <MapPin className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeSpaces}</div>
            <p className="text-xs text-muted-foreground">Currently operational</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₦{totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Utilization</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round(avgUtilization)}%</div>
            <p className="text-xs text-muted-foreground">Across all spaces</p>
          </CardContent>
        </Card>
      </div>

      {/* Space Management */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5" />
                Space Management
              </CardTitle>
              <CardDescription>Manage workspace and event space configurations</CardDescription>
            </div>
            <Dialog open={isCreating} onOpenChange={setIsCreating}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Space
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>Add New Space</DialogTitle>
                  <DialogDescription>Create a new workspace or event space</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <Label htmlFor="name">Space Name</Label>
                      <Input id="name" placeholder="Enter space name" />
                    </div>
                    <div>
                      <Label htmlFor="capacity">Capacity</Label>
                      <Input id="capacity" type="number" placeholder="Number of people" />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea id="description" placeholder="Describe the space..." />
                  </div>
                  <div className="flex gap-2 pt-4">
                    <Button className="flex-1">Create Space</Button>
                    <Button variant="outline" onClick={() => setIsCreating(false)} className="flex-1">
                      Cancel
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {spaces.map((space) => (
              <div
                key={space.id}
                className="flex items-center justify-between p-4 border rounded-lg transition-all duration-200 hover:shadow-md"
              >
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-primary/10 rounded-full">
                    {space.type === "coworking" ? (
                      <Users className="h-6 w-6 text-primary" />
                    ) : (
                      <Calendar className="h-6 w-6 text-primary" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-lg">{space.name}</h3>
                      <Badge variant={getStatusColor(space.status) as any}>
                        {space.status.charAt(0).toUpperCase() + space.status.slice(1)}
                      </Badge>
                      <Badge variant="outline">{space.type === "coworking" ? "Coworking" : "Event Space"}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-1">{space.description}</p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {space.capacity} people
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {space.bookingsThisMonth} bookings this month
                      </span>
                      <span className="flex items-center gap-1">
                        <BarChart3 className="h-3 w-3" />
                        {space.utilizationRate}% utilization
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="font-medium">
                      {space.pricePerHour && `₦${space.pricePerHour.toLocaleString()}/hr`}
                      {space.pricePerDay && `₦${space.pricePerDay.toLocaleString()}/day`}
                      {space.pricePerMonth && `₦${space.pricePerMonth.toLocaleString()}/month`}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      ₦{space.revenueThisMonth.toLocaleString()} this month
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" onClick={() => setSelectedSpace(space)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[600px]">
                        <DialogHeader>
                          <DialogTitle>Space Details - {space.name}</DialogTitle>
                          <DialogDescription>View and manage space information</DialogDescription>
                        </DialogHeader>
                        {selectedSpace && (
                          <div className="space-y-4">
                            <div className="grid gap-4 md:grid-cols-2">
                              <div>
                                <label className="text-sm font-medium">Space Type</label>
                                <p className="text-muted-foreground">
                                  {selectedSpace.type === "coworking" ? "Coworking Space" : "Event Space"}
                                </p>
                              </div>
                              <div>
                                <label className="text-sm font-medium">Capacity</label>
                                <p className="text-muted-foreground">{selectedSpace.capacity} people</p>
                              </div>
                              <div>
                                <label className="text-sm font-medium">Status</label>
                                <Badge variant={getStatusColor(selectedSpace.status) as any}>
                                  {selectedSpace.status.charAt(0).toUpperCase() + selectedSpace.status.slice(1)}
                                </Badge>
                              </div>
                              <div>
                                <label className="text-sm font-medium">Utilization Rate</label>
                                <p className="text-muted-foreground">{selectedSpace.utilizationRate}%</p>
                              </div>
                            </div>

                            <div>
                              <label className="text-sm font-medium">Description</label>
                              <p className="text-muted-foreground">{selectedSpace.description}</p>
                            </div>

                            <div>
                              <label className="text-sm font-medium">Amenities</label>
                              <div className="flex flex-wrap gap-2 mt-2">
                                {selectedSpace.amenities.map((amenity, index) => (
                                  <Badge key={index} variant="outline" className="text-xs">
                                    {amenity}
                                  </Badge>
                                ))}
                              </div>
                            </div>

                            <div className="grid gap-4 md:grid-cols-2">
                              <div>
                                <label className="text-sm font-medium">Bookings This Month</label>
                                <p className="text-muted-foreground">{selectedSpace.bookingsThisMonth}</p>
                              </div>
                              <div>
                                <label className="text-sm font-medium">Revenue This Month</label>
                                <p className="text-muted-foreground">
                                  ₦{selectedSpace.revenueThisMonth.toLocaleString()}
                                </p>
                              </div>
                            </div>

                            <div className="flex gap-2 pt-4">
                              <Button onClick={() => setIsEditing(true)} className="flex-1">
                                <Edit className="mr-2 h-4 w-4" />
                                Edit Space
                              </Button>
                              <Button
                                variant="destructive"
                                onClick={() => deleteSpace(selectedSpace.id)}
                                className="flex-1"
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete Space
                              </Button>
                            </div>
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>

                    <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                      <Edit className="h-4 w-4" />
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const newStatus = space.status === "active" ? "maintenance" : "active"
                        updateSpace(space.id, { status: newStatus })
                      }}
                    >
                      <Settings className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
