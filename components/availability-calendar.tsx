"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CalendarDays, Clock, ChevronLeft, ChevronRight } from "lucide-react"
import { useConflictDetection } from "@/hooks/use-conflict-detection"
import { format, addDays } from "date-fns"

interface AvailabilityCalendarProps {
  spaceId?: string
  spaceName?: string
  onDateSelect?: (date: Date) => void
  onTimeSelect?: (time: string) => void
  selectedDate?: Date
  duration?: number
}

export function AvailabilityCalendar({
  spaceId,
  spaceName,
  onDateSelect,
  onTimeSelect,
  selectedDate,
  duration = 2,
}: AvailabilityCalendarProps) {
  const { getAvailableSlots, getDailyAvailability, existingBookings } = useConflictDetection()
  const [currentDate, setCurrentDate] = useState(selectedDate || new Date())
  const [availableSlots, setAvailableSlots] = useState<any[]>([])
  const [selectedTime, setSelectedTime] = useState<string>("")
  const [viewMode, setViewMode] = useState<"calendar" | "slots">("calendar")

  // Load available slots when date or space changes
  useEffect(() => {
    if (spaceId && currentDate) {
      loadAvailableSlots()
    }
  }, [spaceId, currentDate, duration])

  const loadAvailableSlots = () => {
    if (!spaceId) return

    const dateString = format(currentDate, "yyyy-MM-dd")
    const slots = getAvailableSlots(spaceId, dateString, duration)
    setAvailableSlots(slots)
  }

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setCurrentDate(date)
      onDateSelect?.(date)
      setSelectedTime("")
    }
  }

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time)
    onTimeSelect?.(time)
  }

  const getDateAvailability = (date: Date) => {
    if (!spaceId) return { available: true, utilization: 0 }

    const dateString = format(date, "yyyy-MM-dd")
    const dailyData = getDailyAvailability(spaceId, dateString)

    return {
      available: dailyData.utilizationRate < 100,
      utilization: dailyData.utilizationRate,
      bookings: dailyData.bookings.length,
    }
  }

  const getDateClassName = (date: Date) => {
    const availability = getDateAvailability(date)
    const baseClass = "relative"

    if (!availability.available) {
      return `${baseClass} bg-red-100 text-red-900 hover:bg-red-200`
    }

    if (availability.utilization >= 70) {
      return `${baseClass} bg-yellow-100 text-yellow-900 hover:bg-yellow-200`
    }

    if (availability.utilization > 0) {
      return `${baseClass} bg-blue-100 text-blue-900 hover:bg-blue-200`
    }

    return baseClass
  }

  const renderDateContent = (date: Date) => {
    const availability = getDateAvailability(date)

    return (
      <div className="w-full h-full flex flex-col items-center justify-center">
        <span>{date.getDate()}</span>
        {availability.bookings > 0 && (
          <div className="absolute bottom-0 right-0 w-2 h-2 bg-current rounded-full opacity-60" />
        )}
      </div>
    )
  }

  const getTimeSlotColor = (slot: any) => {
    if (!slot.available) return "destructive"
    return "secondary"
  }

  const formatTimeRange = (startTime: string, duration: number) => {
    const [hours, minutes] = startTime.split(":").map(Number)
    const endHours = hours + duration
    const endTime = `${endHours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`
    return `${startTime} - ${endTime}`
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <CalendarDays className="h-5 w-5" />
                Availability Calendar
              </CardTitle>
              {spaceName && <CardDescription>Select date and time for {spaceName}</CardDescription>}
            </div>
            <Select value={viewMode} onValueChange={(value: any) => setViewMode(value)}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="calendar">Calendar</SelectItem>
                <SelectItem value="slots">Time Slots</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {viewMode === "calendar" ? (
            <div className="space-y-4">
              <Calendar
                mode="single"
                selected={currentDate}
                onSelect={handleDateSelect}
                disabled={(date) => date < new Date()}
                className="rounded-md border"
                modifiers={{
                  booked: (date) => !getDateAvailability(date).available,
                  busy: (date) => getDateAvailability(date).utilization >= 70,
                  available: (date) => getDateAvailability(date).utilization > 0,
                }}
                modifiersClassNames={{
                  booked: "bg-red-100 text-red-900 hover:bg-red-200",
                  busy: "bg-yellow-100 text-yellow-900 hover:bg-yellow-200",
                  available: "bg-blue-100 text-blue-900 hover:bg-blue-200",
                }}
              />

              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-200 rounded" />
                  <span>Available</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-yellow-200 rounded" />
                  <span>Busy</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-200 rounded" />
                  <span>Fully Booked</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-medium">Available Time Slots - {format(currentDate, "EEEE, MMM d, yyyy")}</h3>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentDate(addDays(currentDate, -1))}
                    disabled={currentDate <= new Date()}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setCurrentDate(addDays(currentDate, 1))}>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="grid gap-2 max-h-64 overflow-y-auto">
                {availableSlots.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Clock className="h-8 w-8 mx-auto mb-2" />
                    <p>No available slots for this date</p>
                  </div>
                ) : (
                  availableSlots.map((slot, index) => (
                    <div
                      key={index}
                      className={`p-3 border rounded-lg cursor-pointer transition-all duration-200 ${
                        slot.available
                          ? selectedTime === slot.start
                            ? "border-primary bg-primary/10"
                            : "hover:border-primary/50 hover:bg-primary/5"
                          : "opacity-50 cursor-not-allowed bg-muted"
                      }`}
                      onClick={() => slot.available && handleTimeSelect(slot.start)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Clock className="h-4 w-4" />
                          <div>
                            <div className="font-medium">{formatTimeRange(slot.start, duration)}</div>
                            {!slot.available && slot.reason && (
                              <div className="text-xs text-muted-foreground">{slot.reason}</div>
                            )}
                          </div>
                        </div>
                        <Badge variant={getTimeSlotColor(slot)}>{slot.available ? "Available" : "Booked"}</Badge>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Selected Date Summary */}
      {spaceId && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{format(currentDate, "EEEE, MMM d, yyyy")} - Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="text-center p-3 border rounded-lg">
                <div className="text-xl font-bold text-green-600">
                  {availableSlots.filter((s) => s.available).length}
                </div>
                <div className="text-sm text-muted-foreground">Available Slots</div>
              </div>
              <div className="text-center p-3 border rounded-lg">
                <div className="text-xl font-bold text-red-600">
                  {availableSlots.filter((s) => !s.available).length}
                </div>
                <div className="text-sm text-muted-foreground">Booked Slots</div>
              </div>
              <div className="text-center p-3 border rounded-lg">
                <div className="text-xl font-bold text-blue-600">
                  {Math.round(getDailyAvailability(spaceId, format(currentDate, "yyyy-MM-dd")).utilizationRate)}%
                </div>
                <div className="text-sm text-muted-foreground">Utilization</div>
              </div>
            </div>

            {selectedTime && (
              <div className="mt-4 p-3 bg-primary/10 border border-primary/20 rounded-lg">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-primary" />
                  <span className="font-medium">Selected: {formatTimeRange(selectedTime, duration)}</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
