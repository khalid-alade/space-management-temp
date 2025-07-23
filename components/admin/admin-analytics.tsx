"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { BarChart3, TrendingUp, Users, Calendar, DollarSign, Download, RefreshCw, Target, Activity } from "lucide-react"

export function AdminAnalytics() {
  const [timeRange, setTimeRange] = useState("30d")
  const [isLoading, setIsLoading] = useState(false)

  // Mock analytics data
  const analytics = {
    revenue: {
      current: 2450000,
      previous: 2100000,
      growth: 16.7,
      target: 3000000,
    },
    bookings: {
      current: 156,
      previous: 142,
      growth: 9.9,
      target: 200,
    },
    users: {
      current: 1247,
      previous: 1180,
      growth: 5.7,
      target: 1500,
    },
    utilization: {
      current: 78,
      previous: 72,
      growth: 8.3,
      target: 85,
    },
  }

  const monthlyData = [
    { month: "Jan", revenue: 1800000, bookings: 120, users: 980 },
    { month: "Feb", revenue: 2100000, bookings: 142, users: 1050 },
    { month: "Mar", revenue: 2450000, bookings: 156, users: 1247 },
  ]

  const spacePerformance = [
    { name: "Conference Hall", revenue: 750000, bookings: 15, utilization: 78 },
    { name: "Main Coworking", revenue: 1200000, bookings: 120, utilization: 85 },
    { name: "Meeting Room", revenue: 400000, bookings: 25, utilization: 65 },
    { name: "Training Room", revenue: 240000, bookings: 8, utilization: 45 },
    { name: "Private Offices", revenue: 1200000, bookings: 8, utilization: 90 },
  ]

  const exportReport = () => {
    setIsLoading(true)

    // Simulate export
    setTimeout(() => {
      setIsLoading(false)
      // In a real app, this would generate and download a report
      const data = {
        analytics,
        monthlyData,
        spacePerformance,
        generatedAt: new Date().toISOString(),
      }

      const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `nithub-analytics-${new Date().toISOString().split("T")[0]}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    }, 2000)
  }

  return (
    <div className="space-y-6">
      {/* Controls */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Analytics Dashboard
              </CardTitle>
              <CardDescription>Comprehensive business insights and performance metrics</CardDescription>
            </div>
            <div className="flex items-center gap-4">
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7d">Last 7 days</SelectItem>
                  <SelectItem value="30d">Last 30 days</SelectItem>
                  <SelectItem value="90d">Last 90 days</SelectItem>
                  <SelectItem value="1y">Last year</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" onClick={exportReport} disabled={isLoading}>
                {isLoading ? (
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Download className="mr-2 h-4 w-4" />
                )}
                Export Report
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₦{analytics.revenue.current.toLocaleString()}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="mr-1 h-3 w-3 text-green-500" />+{analytics.revenue.growth}% from last period
            </div>
            <div className="mt-2">
              <div className="flex justify-between text-xs mb-1">
                <span>Target: ₦{analytics.revenue.target.toLocaleString()}</span>
                <span>{Math.round((analytics.revenue.current / analytics.revenue.target) * 100)}%</span>
              </div>
              <Progress value={(analytics.revenue.current / analytics.revenue.target) * 100} className="h-1" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.bookings.current}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="mr-1 h-3 w-3 text-green-500" />+{analytics.bookings.growth}% from last period
            </div>
            <div className="mt-2">
              <div className="flex justify-between text-xs mb-1">
                <span>Target: {analytics.bookings.target}</span>
                <span>{Math.round((analytics.bookings.current / analytics.bookings.target) * 100)}%</span>
              </div>
              <Progress value={(analytics.bookings.current / analytics.bookings.target) * 100} className="h-1" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.users.current.toLocaleString()}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="mr-1 h-3 w-3 text-green-500" />+{analytics.users.growth}% from last period
            </div>
            <div className="mt-2">
              <div className="flex justify-between text-xs mb-1">
                <span>Target: {analytics.users.target.toLocaleString()}</span>
                <span>{Math.round((analytics.users.current / analytics.users.target) * 100)}%</span>
              </div>
              <Progress value={(analytics.users.current / analytics.users.target) * 100} className="h-1" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Space Utilization</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.utilization.current}%</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="mr-1 h-3 w-3 text-green-500" />+{analytics.utilization.growth}% from last period
            </div>
            <div className="mt-2">
              <div className="flex justify-between text-xs mb-1">
                <span>Target: {analytics.utilization.target}%</span>
                <span>{Math.round((analytics.utilization.current / analytics.utilization.target) * 100)}%</span>
              </div>
              <Progress value={(analytics.utilization.current / analytics.utilization.target) * 100} className="h-1" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts and Detailed Analytics */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Monthly Trends */}
        <Card>
          <CardHeader>
            <CardTitle>Monthly Trends</CardTitle>
            <CardDescription>Revenue, bookings, and user growth over time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {monthlyData.map((data, index) => (
                <div key={data.month} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">{data.month} 2024</span>
                    <span className="text-muted-foreground">₦{data.revenue.toLocaleString()}</span>
                  </div>
                  <Progress
                    value={(data.revenue / Math.max(...monthlyData.map((d) => d.revenue))) * 100}
                    className="h-2"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{data.bookings} bookings</span>
                    <span>{data.users.toLocaleString()} users</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Space Performance */}
        <Card>
          <CardHeader>
            <CardTitle>Space Performance</CardTitle>
            <CardDescription>Revenue and utilization by space</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {spacePerformance.map((space, index) => (
                <div key={space.name} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">{space.name}</span>
                    <span className="text-muted-foreground">₦{space.revenue.toLocaleString()}</span>
                  </div>
                  <Progress value={space.utilization} className="h-2" />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{space.bookings} bookings</span>
                    <span>{space.utilization}% utilization</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Insights */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Goal Progress
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Monthly Revenue Goal</span>
                <span>{Math.round((analytics.revenue.current / analytics.revenue.target) * 100)}%</span>
              </div>
              <Progress value={(analytics.revenue.current / analytics.revenue.target) * 100} />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Booking Target</span>
                <span>{Math.round((analytics.bookings.current / analytics.bookings.target) * 100)}%</span>
              </div>
              <Progress value={(analytics.bookings.current / analytics.bookings.target) * 100} />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>User Growth Goal</span>
                <span>{Math.round((analytics.users.current / analytics.users.target) * 100)}%</span>
              </div>
              <Progress value={(analytics.users.current / analytics.users.target) * 100} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Performing Spaces</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {spacePerformance
                .sort((a, b) => b.revenue - a.revenue)
                .slice(0, 3)
                .map((space, index) => (
                  <div key={space.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          index === 0 ? "bg-yellow-500" : index === 1 ? "bg-gray-400" : "bg-orange-500"
                        }`}
                      />
                      <span className="text-sm font-medium">{space.name}</span>
                    </div>
                    <span className="text-sm text-muted-foreground">₦{space.revenue.toLocaleString()}</span>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Key Insights</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-2">
                <TrendingUp className="h-4 w-4 text-green-500 mt-0.5" />
                <div>
                  <p className="font-medium">Revenue Growth</p>
                  <p className="text-muted-foreground">16.7% increase this month</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Users className="h-4 w-4 text-blue-500 mt-0.5" />
                <div>
                  <p className="font-medium">User Acquisition</p>
                  <p className="text-muted-foreground">67 new users this week</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Activity className="h-4 w-4 text-purple-500 mt-0.5" />
                <div>
                  <p className="font-medium">Peak Usage</p>
                  <p className="text-muted-foreground">Tuesdays 2-4 PM</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
