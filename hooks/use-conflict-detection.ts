"use client"

import { useState, useCallback } from "react"
import { toast } from "@/components/ui/use-toast"

interface TimeSlot {
  start: Date
  end: Date
}

interface Booking {
  id: string
  spaceId: string
  spaceName: string
  date: string
  startTime?: string
  duration: number
  type: "coworking" | "event"
  status: "confirmed" | "pending" | "completed" | "cancelled"
  userId?: string
  userName?: string
}

interface ConflictResult {
  hasConflict: boolean
  conflicts: Booking[]
  suggestions: TimeSlot[]
  message?: string
}

interface AvailabilitySlot {
  start: string
  end: string
  available: boolean
  reason?: string
}

export function useConflictDetection() {
  const [isChecking, setIsChecking] = useState(false)

  // Mock existing bookings data
  const [existingBookings] = useState<Booking[]>([
    {
      id: "BK001",
      spaceId: "conference-hall",
      spaceName: "Conference Hall",
      date: "2024-02-01",
      startTime: "09:00",
      duration: 4,
      type: "event",
      status: "confirmed",
      userId: "user-1",
      userName: "John Doe",
    },
    {
      id: "BK002",
      spaceId: "conference-hall",
      spaceName: "Conference Hall",
      date: "2024-02-01",
      startTime: "14:00",
      duration: 3,
      type: "event",
      status: "confirmed",
      userId: "user-2",
      userName: "Jane Smith",
    },
    {
      id: "BK003",
      spaceId: "meeting-room",
      spaceName: "Executive Meeting Room",
      date: "2024-02-01",
      startTime: "10:00",
      duration: 2,
      type: "event",
      status: "confirmed",
      userId: "user-3",
      userName: "Mike Johnson",
    },
    {
      id: "BK004",
      spaceId: "training-room",
      spaceName: "Training Room",
      date: "2024-02-02",
      startTime: "09:00",
      duration: 6,
      type: "event",
      status: "pending",
      userId: "user-4",
      userName: "Sarah Wilson",
    },
  ])

  // Business hours configuration
  const businessHours = {
    start: 8, // 8 AM
    end: 20, // 8 PM
  }

  // Convert time string to minutes since midnight
  const timeToMinutes = useCallback((timeString: string): number => {
    const [hours, minutes] = timeString.split(":").map(Number)
    return hours * 60 + minutes
  }, [])

  // Convert minutes since midnight to time string
  const minutesToTime = useCallback((minutes: number): string => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return `${hours.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}`
  }, [])

  // Check if two time ranges overlap
  const hasTimeOverlap = useCallback((start1: number, end1: number, start2: number, end2: number): boolean => {
    return start1 < end2 && start2 < end1
  }, [])

  // Get available time slots for a specific date and space
  const getAvailableSlots = useCallback(
    (spaceId: string, date: string, requestedDuration: number): AvailabilitySlot[] => {
      const dateBookings = existingBookings.filter(
        (booking) => booking.spaceId === spaceId && booking.date === date && booking.status !== "cancelled",
      )

      const slots: AvailabilitySlot[] = []
      const slotDuration = 60 // 1 hour slots
      const businessStartMinutes = businessHours.start * 60
      const businessEndMinutes = businessHours.end * 60

      for (let time = businessStartMinutes; time < businessEndMinutes; time += slotDuration) {
        const slotStart = time
        const slotEnd = time + requestedDuration * 60

        if (slotEnd > businessEndMinutes) break

        let isAvailable = true
        let conflictReason = ""

        // Check against existing bookings
        for (const booking of dateBookings) {
          const bookingStart = timeToMinutes(booking.startTime || "09:00")
          const bookingEnd = bookingStart + booking.duration * 60

          if (hasTimeOverlap(slotStart, slotEnd, bookingStart, bookingEnd)) {
            isAvailable = false
            conflictReason = `Conflicts with ${booking.userName}'s booking (${booking.startTime}-${minutesToTime(bookingEnd)})`
            break
          }
        }

        slots.push({
          start: minutesToTime(slotStart),
          end: minutesToTime(slotEnd),
          available: isAvailable,
          reason: conflictReason || undefined,
        })
      }

      return slots
    },
    [existingBookings, timeToMinutes, minutesToTime, hasTimeOverlap, businessHours],
  )

  // Check for conflicts with a specific booking request
  const checkConflicts = useCallback(
    async (
      spaceId: string,
      date: string,
      startTime: string,
      duration: number,
      excludeBookingId?: string,
    ): Promise<ConflictResult> => {
      setIsChecking(true)

      try {
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 1000))

        const requestStart = timeToMinutes(startTime)
        const requestEnd = requestStart + duration * 60

        // Check if within business hours
        const businessStartMinutes = businessHours.start * 60
        const businessEndMinutes = businessHours.end * 60

        if (requestStart < businessStartMinutes || requestEnd > businessEndMinutes) {
          return {
            hasConflict: true,
            conflicts: [],
            suggestions: [],
            message: `Booking must be within business hours (${businessHours.start}:00 - ${businessHours.end}:00)`,
          }
        }

        // Find conflicting bookings
        const conflicts = existingBookings.filter((booking) => {
          if (booking.id === excludeBookingId) return false
          if (booking.spaceId !== spaceId) return false
          if (booking.date !== date) return false
          if (booking.status === "cancelled") return false

          const bookingStart = timeToMinutes(booking.startTime || "09:00")
          const bookingEnd = bookingStart + booking.duration * 60

          return hasTimeOverlap(requestStart, requestEnd, bookingStart, bookingEnd)
        })

        // Generate alternative time suggestions if there are conflicts
        const suggestions: TimeSlot[] = []
        if (conflicts.length > 0) {
          const availableSlots = getAvailableSlots(spaceId, date, duration)
          const availableSlotTimes = availableSlots
            .filter((slot) => slot.available)
            .slice(0, 3) // Suggest up to 3 alternatives
            .map((slot) => ({
              start: new Date(`${date}T${slot.start}:00`),
              end: new Date(`${date}T${slot.end}:00`),
            }))

          suggestions.push(...availableSlotTimes)
        }

        return {
          hasConflict: conflicts.length > 0,
          conflicts,
          suggestions,
          message: conflicts.length > 0 ? `Found ${conflicts.length} scheduling conflict(s)` : "No conflicts found",
        }
      } catch (error) {
        toast({
          title: "Conflict Check Failed",
          description: "Unable to check for scheduling conflicts. Please try again.",
          variant: "destructive",
        })
        throw error
      } finally {
        setIsChecking(false)
      }
    },
    [existingBookings, timeToMinutes, hasTimeOverlap, getAvailableSlots, businessHours],
  )

  // Check coworking space availability (different logic for ongoing memberships)
  const checkCoworkingAvailability = useCallback(
    async (planType: string, startDate: string, duration: number): Promise<ConflictResult> => {
      setIsChecking(true)

      try {
        await new Promise((resolve) => setTimeout(resolve, 800))

        // For coworking, we mainly check capacity limits
        const coworkingBookings = existingBookings.filter(
          (booking) => booking.type === "coworking" && booking.status !== "cancelled",
        )

        // Mock capacity limits
        const capacityLimits = {
          "day-pass": 50,
          "flex-pass": 30,
          dedicated: 10,
        }

        const currentCapacity = coworkingBookings.filter((booking) => {
          const bookingStart = new Date(booking.date)
          const bookingEnd = new Date(bookingStart)
          bookingEnd.setDate(bookingEnd.getDate() + booking.duration)

          const requestStart = new Date(startDate)
          const requestEnd = new Date(requestStart)
          requestEnd.setDate(requestEnd.getDate() + duration)

          // Check if date ranges overlap
          return bookingStart < requestEnd && requestStart < bookingEnd
        }).length

        const limit = capacityLimits[planType as keyof typeof capacityLimits] || 50
        const hasConflict = currentCapacity >= limit

        return {
          hasConflict,
          conflicts: [],
          suggestions: [],
          message: hasConflict
            ? `Coworking space at capacity (${currentCapacity}/${limit}). Please choose different dates.`
            : `Available (${currentCapacity}/${limit} spots taken)`,
        }
      } catch (error) {
        toast({
          title: "Availability Check Failed",
          description: "Unable to check coworking availability. Please try again.",
          variant: "destructive",
        })
        throw error
      } finally {
        setIsChecking(false)
      }
    },
    [existingBookings],
  )

  // Get daily availability overview for a space
  const getDailyAvailability = useCallback(
    (spaceId: string, date: string) => {
      const dateBookings = existingBookings.filter(
        (booking) => booking.spaceId === spaceId && booking.date === date && booking.status !== "cancelled",
      )

      const totalBusinessHours = businessHours.end - businessHours.start
      const bookedHours = dateBookings.reduce((total, booking) => total + booking.duration, 0)
      const availableHours = totalBusinessHours - bookedHours

      return {
        totalHours: totalBusinessHours,
        bookedHours,
        availableHours,
        utilizationRate: (bookedHours / totalBusinessHours) * 100,
        bookings: dateBookings,
      }
    },
    [existingBookings, businessHours],
  )

  // Get weekly availability overview
  const getWeeklyAvailability = useCallback(
    (spaceId: string, startDate: string) => {
      const weekDays = []
      const start = new Date(startDate)

      for (let i = 0; i < 7; i++) {
        const date = new Date(start)
        date.setDate(start.getDate() + i)
        const dateString = date.toISOString().split("T")[0]

        weekDays.push({
          date: dateString,
          dayName: date.toLocaleDateString("en-US", { weekday: "short" }),
          ...getDailyAvailability(spaceId, dateString),
        })
      }

      return weekDays
    },
    [getDailyAvailability],
  )

  return {
    isChecking,
    checkConflicts,
    checkCoworkingAvailability,
    getAvailableSlots,
    getDailyAvailability,
    getWeeklyAvailability,
    existingBookings,
  }
}
