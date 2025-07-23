"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { toast } from "@/components/ui/use-toast"
import { Calendar, CheckCircle, ExternalLink, Settings, FolderSyncIcon as Sync } from "lucide-react"

interface CalendarProvider {
  id: string
  name: string
  type: "google" | "outlook"
  email: string
  isConnected: boolean
  lastSync?: string
  syncEnabled: boolean
}

interface CalendarEvent {
  id: string
  bookingId: string
  title: string
  start: string
  end: string
  location: string
  description: string
  provider: string
  synced: boolean
}

export function CalendarSync() {
  const [providers, setProviders] = useState<CalendarProvider[]>([
    {
      id: "google-1",
      name: "Google Calendar",
      type: "google",
      email: "demo@gmail.com",
      isConnected: true,
      lastSync: "2024-01-30T10:30:00Z",
      syncEnabled: true,
    },
    {
      id: "outlook-1",
      name: "Outlook Calendar",
      type: "outlook",
      email: "demo@outlook.com",
      isConnected: false,
      syncEnabled: false,
    },
  ])

  const [events, setEvents] = useState<CalendarEvent[]>([
    {
      id: "evt-1",
      bookingId: "BK001",
      title: "Nithub Coworking - Flex Pass",
      start: "2024-01-15T09:00:00Z",
      end: "2024-02-14T18:00:00Z",
      location: "Nithub, University of Lagos",
      description: "Monthly coworking membership at Nithub",
      provider: "google-1",
      synced: true,
    },
    {
      id: "evt-2",
      bookingId: "BK002",
      title: "Product Launch Event - Conference Hall",
      start: "2024-01-20T14:00:00Z",
      end: "2024-01-20T18:00:00Z",
      location: "Nithub Conference Hall, University of Lagos",
      description: "Product launch event in the main conference hall",
      provider: "google-1",
      synced: true,
    },
  ])

  const [isConnecting, setIsConnecting] = useState<string | null>(null)
  const [isSyncing, setIsSyncing] = useState(false)

  const connectCalendar = async (type: "google" | "outlook") => {
    setIsConnecting(type)

    // Simulate OAuth flow
    await new Promise((resolve) => setTimeout(resolve, 2000))

    const newProvider: CalendarProvider = {
      id: `${type}-${Date.now()}`,
      name: type === "google" ? "Google Calendar" : "Outlook Calendar",
      type,
      email: `demo@${type === "google" ? "gmail" : "outlook"}.com`,
      isConnected: true,
      lastSync: new Date().toISOString(),
      syncEnabled: true,
    }

    setProviders((prev) => prev.map((p) => (p.type === type ? newProvider : p)))
    setIsConnecting(null)

    toast({
      title: "Calendar Connected",
      description: `Successfully connected to ${newProvider.name}`,
    })
  }

  const disconnectCalendar = (providerId: string) => {
    setProviders((prev) =>
      prev.map((p) => (p.id === providerId ? { ...p, isConnected: false, syncEnabled: false } : p)),
    )

    // Remove events from this provider
    setEvents((prev) => prev.filter((e) => e.provider !== providerId))

    toast({
      title: "Calendar Disconnected",
      description: "Calendar has been disconnected and events removed",
    })
  }

  const toggleSync = (providerId: string, enabled: boolean) => {
    setProviders((prev) => prev.map((p) => (p.id === providerId ? { ...p, syncEnabled: enabled } : p)))

    toast({
      title: enabled ? "Sync Enabled" : "Sync Disabled",
      description: `Calendar sync has been ${enabled ? "enabled" : "disabled"}`,
    })
  }

  const syncNow = async () => {
    setIsSyncing(true)

    // Simulate sync process
    await new Promise((resolve) => setTimeout(resolve, 3000))

    // Update last sync time for connected providers
    setProviders((prev) => prev.map((p) => (p.isConnected ? { ...p, lastSync: new Date().toISOString() } : p)))

    setIsSyncing(false)

    toast({
      title: "Sync Complete",
      description: "All bookings have been synced to your calendars",
    })
  }

  const createCalendarEvent = async (bookingId: string, providerId: string) => {
    // Simulate creating calendar event
    await new Promise((resolve) => setTimeout(resolve, 1500))

    const newEvent: CalendarEvent = {
      id: `evt-${Date.now()}`,
      bookingId,
      title: "New Booking Event",
      start: new Date().toISOString(),
      end: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
      location: "Nithub, University of Lagos",
      description: "Booking created from Nithub",
      provider: providerId,
      synced: true,
    }

    setEvents((prev) => [...prev, newEvent])

    toast({
      title: "Event Created",
      description: "Booking has been added to your calendar",
    })
  }

  return (
    <div className="space-y-6">
      {/* Calendar Providers */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Calendar Integration
          </CardTitle>
          <CardDescription>Connect your calendars to automatically sync your Nithub bookings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {providers.map((provider) => (
            <div
              key={provider.id}
              className="flex items-center justify-between p-4 border rounded-lg transition-all duration-200 hover:shadow-md"
            >
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-primary/10 rounded-full">
                  <Calendar className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium">{provider.name}</h3>
                    {provider.isConnected ? (
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Connected
                      </Badge>
                    ) : (
                      <Badge variant="outline">Not Connected</Badge>
                    )}
                  </div>
                  {provider.isConnected && (
                    <div className="text-sm text-muted-foreground">
                      <p>{provider.email}</p>
                      {provider.lastSync && <p>Last sync: {new Date(provider.lastSync).toLocaleString()}</p>}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-4">
                {provider.isConnected && (
                  <div className="flex items-center space-x-2">
                    <span className="text-sm">Auto-sync</span>
                    <Switch
                      checked={provider.syncEnabled}
                      onCheckedChange={(checked) => toggleSync(provider.id, checked)}
                    />
                  </div>
                )}

                {provider.isConnected ? (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => disconnectCalendar(provider.id)}
                    className="transition-all duration-200 hover:scale-105"
                  >
                    Disconnect
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    onClick={() => connectCalendar(provider.type)}
                    disabled={isConnecting === provider.type}
                    className="transition-all duration-200 hover:scale-105"
                  >
                    {isConnecting === provider.type ? "Connecting..." : "Connect"}
                  </Button>
                )}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Sync Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sync className="h-5 w-5" />
            Sync Management
          </CardTitle>
          <CardDescription>Manage how your bookings are synced with your calendars</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Manual Sync</h3>
              <p className="text-sm text-muted-foreground">Sync all bookings to connected calendars now</p>
            </div>
            <Button onClick={syncNow} disabled={isSyncing} className="transition-all duration-200 hover:scale-105">
              {isSyncing ? (
                <>
                  <Sync className="h-4 w-4 mr-2 animate-spin" />
                  Syncing...
                </>
              ) : (
                <>
                  <Sync className="h-4 w-4 mr-2" />
                  Sync Now
                </>
              )}
            </Button>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-2">Sync Settings</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Auto-sync new bookings:</span>
                  <Badge variant="secondary">Enabled</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Sync cancellations:</span>
                  <Badge variant="secondary">Enabled</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Reminder notifications:</span>
                  <Badge variant="secondary">15 min before</Badge>
                </div>
              </div>
            </div>

            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-2">Sync Status</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Total events synced:</span>
                  <span className="font-medium">{events.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Connected calendars:</span>
                  <span className="font-medium">{providers.filter((p) => p.isConnected).length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Last sync:</span>
                  <span className="font-medium">
                    {providers.find((p) => p.lastSync)?.lastSync
                      ? new Date(providers.find((p) => p.lastSync)!.lastSync!).toLocaleTimeString()
                      : "Never"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Synced Events */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5" />
            Synced Events
          </CardTitle>
          <CardDescription>Your Nithub bookings that have been synced to your calendars</CardDescription>
        </CardHeader>
        <CardContent>
          {events.length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-medium mb-2">No synced events</h3>
              <p className="text-muted-foreground">Connect a calendar and make a booking to see synced events here.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {events.map((event) => (
                <div
                  key={event.id}
                  className="flex items-center justify-between p-4 border rounded-lg transition-all duration-200 hover:shadow-md"
                >
                  <div className="flex items-center space-x-4">
                    <div className="p-2 bg-green-100 rounded-full">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-medium">{event.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {new Date(event.start).toLocaleDateString()} - {new Date(event.end).toLocaleDateString()}
                      </p>
                      <p className="text-sm text-muted-foreground">{event.location}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline">{providers.find((p) => p.id === event.provider)?.name || "Unknown"}</Badge>
                    <Button variant="ghost" size="sm" className="transition-all duration-200 hover:scale-105">
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Calendar Sync Settings Dialog */}
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" className="w-full transition-all duration-200 hover:scale-[1.02]">
            <Settings className="h-4 w-4 mr-2" />
            Advanced Sync Settings
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Calendar Sync Settings</DialogTitle>
            <DialogDescription>Configure how your bookings are synced with your calendars</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Default Calendar</label>
              <Select defaultValue="google-1">
                <SelectTrigger>
                  <SelectValue placeholder="Select default calendar" />
                </SelectTrigger>
                <SelectContent>
                  {providers
                    .filter((p) => p.isConnected)
                    .map((provider) => (
                      <SelectItem key={provider.id} value={provider.id}>
                        {provider.name} ({provider.email})
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Reminder Time</label>
              <Select defaultValue="15">
                <SelectTrigger>
                  <SelectValue placeholder="Select reminder time" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5 minutes before</SelectItem>
                  <SelectItem value="15">15 minutes before</SelectItem>
                  <SelectItem value="30">30 minutes before</SelectItem>
                  <SelectItem value="60">1 hour before</SelectItem>
                  <SelectItem value="1440">1 day before</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Auto-sync new bookings</p>
                  <p className="text-xs text-muted-foreground">Automatically add new bookings to calendar</p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Sync booking updates</p>
                  <p className="text-xs text-muted-foreground">Update calendar events when bookings change</p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Remove cancelled bookings</p>
                  <p className="text-xs text-muted-foreground">Delete calendar events for cancelled bookings</p>
                </div>
                <Switch defaultChecked />
              </div>
            </div>

            <div className="pt-4">
              <Button className="w-full">Save Settings</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
