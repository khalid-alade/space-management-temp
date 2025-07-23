"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Users, Search, Eye, UserCheck, UserX, Mail, Phone, Calendar, CreditCard, Ban, CheckCircle } from "lucide-react"
import { toast } from "@/components/ui/use-toast"

interface User {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  joinDate: string
  status: "active" | "suspended" | "pending"
  totalBookings: number
  totalSpent: number
  lastLogin?: string
  avatar?: string
}

export function UserManagement() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedUser, setSelectedUser] = useState<User | null>(null)

  // Mock user data
  const [users, setUsers] = useState<User[]>([
    {
      id: "user-1",
      firstName: "John",
      lastName: "Doe",
      email: "john@example.com",
      phone: "08012345678",
      joinDate: "2023-06-15T00:00:00Z",
      status: "active",
      totalBookings: 12,
      totalSpent: 250000,
      lastLogin: "2024-01-30T08:30:00Z",
    },
    {
      id: "user-2",
      firstName: "Jane",
      lastName: "Smith",
      email: "jane@example.com",
      phone: "08087654321",
      joinDate: "2023-08-22T00:00:00Z",
      status: "active",
      totalBookings: 8,
      totalSpent: 180000,
      lastLogin: "2024-01-29T16:45:00Z",
    },
    {
      id: "user-3",
      firstName: "Mike",
      lastName: "Johnson",
      email: "mike@example.com",
      phone: "08055555555",
      joinDate: "2024-01-10T00:00:00Z",
      status: "pending",
      totalBookings: 2,
      totalSpent: 35000,
      lastLogin: "2024-01-28T12:20:00Z",
    },
    {
      id: "user-4",
      firstName: "Sarah",
      lastName: "Wilson",
      email: "sarah@example.com",
      phone: "08099999999",
      joinDate: "2023-12-05T00:00:00Z",
      status: "suspended",
      totalBookings: 15,
      totalSpent: 320000,
      lastLogin: "2024-01-25T09:15:00Z",
    },
    {
      id: "user-5",
      firstName: "David",
      lastName: "Brown",
      email: "david@example.com",
      phone: "08077777777",
      joinDate: "2023-09-18T00:00:00Z",
      status: "active",
      totalBookings: 25,
      totalSpent: 450000,
      lastLogin: "2024-01-30T14:10:00Z",
    },
  ])

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phone.includes(searchTerm)

    const matchesStatus = statusFilter === "all" || user.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const updateUserStatus = (userId: string, newStatus: "active" | "suspended" | "pending") => {
    setUsers((prev) => prev.map((user) => (user.id === userId ? { ...user, status: newStatus } : user)))

    toast({
      title: "User Status Updated",
      description: `User status has been changed to ${newStatus}.`,
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "secondary"
      case "suspended":
        return "destructive"
      case "pending":
        return "outline"
      default:
        return "outline"
    }
  }

  const activeUsers = users.filter((u) => u.status === "active").length
  const pendingUsers = users.filter((u) => u.status === "pending").length
  const suspendedUsers = users.filter((u) => u.status === "suspended").length
  const totalRevenue = users.reduce((sum, u) => sum + u.totalSpent, 0)

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.length}</div>
            <p className="text-xs text-muted-foreground">Registered members</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <UserCheck className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeUsers}</div>
            <p className="text-xs text-muted-foreground">Currently active</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Approval</CardTitle>
            <UserX className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingUsers}</div>
            <p className="text-xs text-muted-foreground">Awaiting verification</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₦{totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">From all users</p>
          </CardContent>
        </Card>
      </div>

      {/* User Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            User Management
          </CardTitle>
          <CardDescription>Manage user accounts and permissions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Users List */}
          <div className="space-y-4">
            {filteredUsers.length === 0 ? (
              <div className="text-center py-8">
                <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-medium mb-2">No users found</h3>
                <p className="text-muted-foreground">
                  {searchTerm || statusFilter !== "all"
                    ? "Try adjusting your filters to see more results."
                    : "No users registered yet."}
                </p>
              </div>
            ) : (
              filteredUsers.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between p-4 border rounded-lg transition-all duration-200 hover:shadow-md"
                >
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={user.avatar || "/placeholder.svg"} alt={`${user.firstName} ${user.lastName}`} />
                      <AvatarFallback>
                        {user.firstName.charAt(0)}
                        {user.lastName.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium">
                          {user.firstName} {user.lastName}
                        </p>
                        <Badge variant={getStatusColor(user.status) as any}>
                          {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          {user.email}
                        </span>
                        <span className="flex items-center gap-1">
                          <Phone className="h-3 w-3" />
                          {user.phone}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          Joined {new Date(user.joinDate).toLocaleDateString()}
                        </span>
                        {user.lastLogin && <span>Last login: {new Date(user.lastLogin).toLocaleDateString()}</span>}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className="font-medium">{user.totalBookings} bookings</p>
                      <p className="text-sm text-muted-foreground">₦{user.totalSpent.toLocaleString()} spent</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm" onClick={() => setSelectedUser(user)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[600px]">
                          <DialogHeader>
                            <DialogTitle>
                              User Details - {user.firstName} {user.lastName}
                            </DialogTitle>
                            <DialogDescription>View and manage user account information</DialogDescription>
                          </DialogHeader>
                          {selectedUser && (
                            <div className="space-y-4">
                              <div className="flex items-center gap-4">
                                <Avatar className="h-16 w-16">
                                  <AvatarImage
                                    src={selectedUser.avatar || "/placeholder.svg"}
                                    alt={`${selectedUser.firstName} ${selectedUser.lastName}`}
                                  />
                                  <AvatarFallback className="text-lg">
                                    {selectedUser.firstName.charAt(0)}
                                    {selectedUser.lastName.charAt(0)}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <h3 className="text-lg font-medium">
                                    {selectedUser.firstName} {selectedUser.lastName}
                                  </h3>
                                  <Badge variant={getStatusColor(selectedUser.status) as any}>
                                    {selectedUser.status.charAt(0).toUpperCase() + selectedUser.status.slice(1)}
                                  </Badge>
                                </div>
                              </div>

                              <div className="grid gap-4 md:grid-cols-2">
                                <div>
                                  <label className="text-sm font-medium">Email</label>
                                  <p className="text-muted-foreground">{selectedUser.email}</p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium">Phone</label>
                                  <p className="text-muted-foreground">{selectedUser.phone}</p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium">Join Date</label>
                                  <p className="text-muted-foreground">
                                    {new Date(selectedUser.joinDate).toLocaleDateString()}
                                  </p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium">Last Login</label>
                                  <p className="text-muted-foreground">
                                    {selectedUser.lastLogin
                                      ? new Date(selectedUser.lastLogin).toLocaleDateString()
                                      : "Never"}
                                  </p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium">Total Bookings</label>
                                  <p className="text-muted-foreground">{selectedUser.totalBookings}</p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium">Total Spent</label>
                                  <p className="text-muted-foreground">₦{selectedUser.totalSpent.toLocaleString()}</p>
                                </div>
                              </div>

                              <div className="flex gap-2 pt-4">
                                {selectedUser.status === "pending" && (
                                  <Button
                                    onClick={() => updateUserStatus(selectedUser.id, "active")}
                                    className="flex-1"
                                  >
                                    <CheckCircle className="mr-2 h-4 w-4" />
                                    Approve User
                                  </Button>
                                )}
                                {selectedUser.status === "active" && (
                                  <Button
                                    variant="destructive"
                                    onClick={() => updateUserStatus(selectedUser.id, "suspended")}
                                    className="flex-1"
                                  >
                                    <Ban className="mr-2 h-4 w-4" />
                                    Suspend User
                                  </Button>
                                )}
                                {selectedUser.status === "suspended" && (
                                  <Button
                                    onClick={() => updateUserStatus(selectedUser.id, "active")}
                                    className="flex-1"
                                  >
                                    <CheckCircle className="mr-2 h-4 w-4" />
                                    Reactivate User
                                  </Button>
                                )}
                              </div>
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>

                      {user.status === "pending" && (
                        <Button
                          size="sm"
                          onClick={() => updateUserStatus(user.id, "active")}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <CheckCircle className="h-4 w-4" />
                        </Button>
                      )}

                      {user.status === "active" && (
                        <Button size="sm" variant="destructive" onClick={() => updateUserStatus(user.id, "suspended")}>
                          <Ban className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
