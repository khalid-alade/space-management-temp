"use client"

import { useState, useCallback } from "react"
import { toast } from "@/components/ui/use-toast"

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

interface BookingData {
  id: string
  type: "coworking" | "event"
  spaceName: string
  date: string
  duration: number
  amount: number
  status: string
  description?: string
}

export function useCalendarSync() {
  const [providers, setProviders] = useState<CalendarProvider[]>([])
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [isLoading, setIsLoading] = useState(false)

  // Simulate Google Calendar OAuth
  const connectGoogleCalendar = useCallback(async () => {
    setIsLoading(true)

    try {
      // In a real app, this would initiate OAuth flow
      // window.location.href = `https://accounts.google.com/oauth/authorize?...`

      // Simulate OAuth success
      await new Promise((resolve) => setTimeout(resolve, 2000))

      const newProvider: CalendarProvider = {
        id: `google-${Date.now()}`,
        name: "Google Calendar",
        type: "google",
        email: "user@gmail.com",
        isConnected: true,
        lastSync: new Date().toISOString(),
        syncEnabled: true,
      }

      setProviders((prev) => [...prev.filter((p) => p.type !== "google"), newProvider])

      toast({
        title: "Google Calendar Connected",
        description: "Successfully connected to Google Calendar",
      })

      return newProvider
    } catch (error) {
      toast({
        title: "Connection Failed",
        description: "Failed to connect to Google Calendar",
        variant: "destructive",
      })
      throw error
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Simulate Outlook Calendar OAuth
  const connectOutlookCalendar = useCallback(async () => {
    setIsLoading(true)

    try {
      // In a real app, this would initiate Microsoft OAuth flow
      // window.location.href = `https://login.microsoftonline.com/common/oauth2/v2.0/authorize?...`

      // Simulate OAuth success
      await new Promise((resolve) => setTimeout(resolve, 2000))

      const newProvider: CalendarProvider = {
        id: `outlook-${Date.now()}`,
        name: "Outlook Calendar",
        type: "outlook",
        email: "user@outlook.com",
        isConnected: true,
        lastSync: new Date().toISOString(),
        syncEnabled: true,
      }

      setProviders((prev) => [...prev.filter((p) => p.type !== "outlook"), newProvider])

      toast({
        title: "Outlook Calendar Connected",
        description: "Successfully connected to Outlook Calendar",
      })

      return newProvider
    } catch (error) {
      toast({
        title: "Connection Failed",
        description: "Failed to connect to Outlook Calendar",
        variant: "destructive",
      })
      throw error
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Create calendar event from booking
  const createCalendarEvent = useCallback(
    async (booking: BookingData, providerId: string) => {
      setIsLoading(true)

      try {
        const provider = providers.find((p) => p.id === providerId)
        if (!provider || !provider.isConnected) {
          throw new Error("Calendar provider not connected")
        }

        // Calculate event times
        const startDate = new Date(booking.date)
        const endDate = new Date(startDate)

        if (booking.type === "coworking") {
          // For coworking, set business hours (9 AM - 6 PM)
          startDate.setHours(9, 0, 0, 0)
          endDate.setDate(endDate.getDate() + booking.duration - 1)
          endDate.setHours(18, 0, 0, 0)
        } else {
          // For events, use the specified duration in hours
          startDate.setHours(9, 0, 0, 0) // Default start time
          endDate.setTime(startDate.getTime() + booking.duration * 60 * 60 * 1000)
        }

        const eventData = {
          summary: `Nithub ${booking.type === "coworking" ? "Coworking" : "Event"} - ${booking.spaceName}`,
          description:
            booking.description || `${booking.type === "coworking" ? "Coworking space" : "Event"} booking at Nithub`,
          location: "Nithub, University of Lagos, Akoka, Lagos, Nigeria",
          start: {
            dateTime: startDate.toISOString(),
            timeZone: "Africa/Lagos",
          },
          end: {
            dateTime: endDate.toISOString(),
            timeZone: "Africa/Lagos",
          },
          reminders: {
            useDefault: false,
            overrides: [
              { method: "email", minutes: 24 * 60 }, // 1 day before
              { method: "popup", minutes: 15 }, // 15 minutes before
            ],
          },
        }

        // In a real app, this would make API calls to Google Calendar or Microsoft Graph
        if (provider.type === "google") {
          // await gapi.client.calendar.events.insert({
          //   calendarId: 'primary',
          //   resource: eventData
          // })
        } else if (provider.type === "outlook") {
          // await fetch('https://graph.microsoft.com/v1.0/me/events', {
          //   method: 'POST',
          //   headers: { 'Authorization': `Bearer ${accessToken}` },
          //   body: JSON.stringify(eventData)
          // })
        }

        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1500))

        const newEvent: CalendarEvent = {
          id: `evt-${Date.now()}`,
          bookingId: booking.id,
          title: eventData.summary,
          start: eventData.start.dateTime,
          end: eventData.end.dateTime,
          location: eventData.location,
          description: eventData.description,
          provider: providerId,
          synced: true,
        }

        setEvents((prev) => [...prev, newEvent])

        toast({
          title: "Event Created",
          description: `Booking has been added to your ${provider.name}`,
        })

        return newEvent
      } catch (error) {
        toast({
          title: "Sync Failed",
          description: "Failed to create calendar event",
          variant: "destructive",
        })
        throw error
      } finally {
        setIsLoading(false)
      }
    },
    [providers],
  )

  // Sync all bookings to calendar
  const syncAllBookings = useCallback(
    async (bookings: BookingData[]) => {
      setIsLoading(true)

      try {
        const connectedProviders = providers.filter((p) => p.isConnected && p.syncEnabled)

        if (connectedProviders.length === 0) {
          toast({
            title: "No Calendars Connected",
            description: "Please connect a calendar to sync your bookings",
            variant: "destructive",
          })
          return
        }

        // Use the first connected provider as default
        const defaultProvider = connectedProviders[0]

        for (const booking of bookings) {
          // Check if event already exists
          const existingEvent = events.find((e) => e.bookingId === booking.id)
          if (!existingEvent) {
            await createCalendarEvent(booking, defaultProvider.id)
          }
        }

        // Update last sync time
        setProviders((prev) => prev.map((p) => (p.isConnected ? { ...p, lastSync: new Date().toISOString() } : p)))

        toast({
          title: "Sync Complete",
          description: "All bookings have been synced to your calendar",
        })
      } catch (error) {
        toast({
          title: "Sync Failed",
          description: "Failed to sync some bookings",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    },
    [providers, events, createCalendarEvent],
  )

  // Disconnect calendar
  const disconnectCalendar = useCallback((providerId: string) => {
    setProviders((prev) =>
      prev.map((p) => (p.id === providerId ? { ...p, isConnected: false, syncEnabled: false } : p)),
    )

    // Remove events from this provider
    setEvents((prev) => prev.filter((e) => e.provider !== providerId))

    toast({
      title: "Calendar Disconnected",
      description: "Calendar has been disconnected and events removed",
    })
  }, [])

  // Toggle sync for a provider
  const toggleSync = useCallback((providerId: string, enabled: boolean) => {
    setProviders((prev) => prev.map((p) => (p.id === providerId ? { ...p, syncEnabled: enabled } : p)))

    toast({
      title: enabled ? "Sync Enabled" : "Sync Disabled",
      description: `Calendar sync has been ${enabled ? "enabled" : "disabled"}`,
    })
  }, [])

  return {
    providers,
    events,
    isLoading,
    connectGoogleCalendar,
    connectOutlookCalendar,
    createCalendarEvent,
    syncAllBookings,
    disconnectCalendar,
    toggleSync,
  }
}
