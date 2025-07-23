"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import { AlertTriangle, CheckCircle, Clock, Users, Calendar, RefreshCw, TrendingUp, AlertCircle } from "lucide-react"
import { useConflictDetection } from "@/hooks/use-conflict-detection"
import { format } from "date-fns"

interface ConflictCheckerProps {
  spaceId?: string
  spaceName?: string
  date?: Date
  startTime?: string
  duration?: number
  type?: "coworking" | "event"
  planType?: string
  onConflictResult?: (hasConflict: boolean, message?: string) => void
  showAvailability?: boolean
}

export function ConflictChecker({
  spaceId,
  spaceName,
  date,
  startTime,
  duration,
  type = "event",
  planType,
  onConflictResult,
  showAvailability = true,
}: ConflictCheckerProps) {
  const {
    isChecking,
    checkConflicts,
    checkCoworkingAvailability,
    getAvailableSlots,
    getDailyAvailability,
    getWeeklyAvailability,
  } = useConflictDetection()

  const [conflictResult, setConflictResult] = useState<any>(null)
  const [availabilityData, setAvailabilityData] = useState<any>(null)
  const [weeklyData, setWeeklyData] = useState<any>(null)

  // Auto-check conflicts when parameters change
  useEffect(() => {
    if (spaceId && date && startTime && duration && type === "event") {
      checkForConflicts()
    } else if (planType && date && duration && type === "coworking") {
      checkCoworkingConflicts()
    }
  }, [spaceId, date, startTime, duration, type, planType])

  // Load availability data when space or date changes
  useEffect(() => {
    if (spaceId && date && showAvailability) {
      loadAvailabilityData()
    }
  }, [spaceId, date, showAvailability])

  const checkForConflicts = async () => {
    if (!spaceId || !date || !startTime || !duration) return

    try {
      const dateString = format(date, "yyyy-MM-dd")
      const result = await checkConflicts(spaceId, dateString, startTime, duration)
      setConflictResult(result)
      onConflictResult?.(result.hasConflict, result.message)
    } catch (error) {
      console.error("Conflict check failed:", error)
    }
  }

  const checkCoworkingConflicts = async () => {
    if (!planType || !date || !duration) return

    try {
      const dateString = format(date, "yyyy-MM-dd")
      const result = await checkCoworkingAvailability(planType, dateString, duration)
      setConflictResult(result)
      onConflictResult?.(result.hasConflict, result.message)
    } catch (error) {
      console.error("Availability check failed:", error)
    }
  }

  const loadAvailabilityData = () => {
    if (!spaceId || !date) return

    const dateString = format(date, "yyyy-MM-dd")
    const daily = getDailyAvailability(spaceId, dateString)
    const weekly = getWeeklyAvailability(spaceId, dateString)

    setAvailabilityData(daily)
    setWeeklyData(weekly)
  }

  const getAvailabilityColor = (utilizationRate: number) => {
    if (utilizationRate >= 90) return "text-red-600"
    if (utilizationRate >= 70) return "text-yellow-600"
    return "text-green-600"
  }

  const getAvailabilityStatus = (utilizationRate: number) => {
    if (utilizationRate >= 90) return "High Demand"
    if (utilizationRate >= 70) return "Moderate Demand"
    if (utilizationRate >= 30) return "Available"
    return "Low Demand"
  }

  return (
    <div className="space-y-4">
      {/* Conflict Check Results */}
      {conflictResult && (
        <Card className="transition-all duration-300 hover:shadow-md">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              {conflictResult.hasConflict ? (
                <AlertTriangle className="h-5 w-5 text-red-500" />
              ) : (
                <CheckCircle className="h-5 w-5 text-green-500" />
              )}
              Conflict Check Results
              <Button
                variant="ghost"
                size="sm"
                onClick={type === "event" ? checkForConflicts : checkCoworkingConflicts}
                disabled={isChecking}
                className="ml-auto"
              >
                <RefreshCw className={`h-4 w-4 ${isChecking ? "animate-spin" : ""}`} />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert variant={conflictResult.hasConflict ? "destructive" : "default"}>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{conflictResult.message}</AlertDescription>
            </Alert>

            {/* Show conflicts */}
            {conflictResult.conflicts && conflictResult.conflicts.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-medium text-sm">Conflicting Bookings:</h4>
                {conflictResult.conflicts.map((conflict: any) => (
                  <div key={conflict.id} className="p-3 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-sm">{conflict.userName}</p>
                        <p className="text-xs text-muted-foreground">
                          {conflict.startTime} - {conflict.duration} hours • {conflict.spaceName}
                        </p>
                      </div>
                      <Badge variant="destructive" className="text-xs">
                        {conflict.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Show alternative suggestions */}
            {conflictResult.suggestions && conflictResult.suggestions.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-medium text-sm">Suggested Alternative Times:</h4>
                <div className="grid gap-2">
                  {conflictResult.suggestions.map((suggestion: any, index: number) => (
                    <div key={index} className="p-3 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-green-600" />
                          <span className="text-sm font-medium">
                            {format(suggestion.start, "HH:mm")} - {format(suggestion.end, "HH:mm")}
                          </span>
                        </div>
                        <Badge variant="secondary" className="bg-green-100 text-green-800">
                          Available
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Daily Availability Overview */}
      {showAvailability && availabilityData && (
        <Card className="transition-all duration-300 hover:shadow-md">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <TrendingUp className="h-5 w-5" />
              Daily Availability
              {date && (
                <span className="text-sm font-normal text-muted-foreground ml-2">{format(date, "EEEE, MMM d")}</span>
              )}
            </CardTitle>
            <CardDescription>Space utilization and booking overview</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
              <div className="text-center p-3 border rounded-lg">
                <div className="text-2xl font-bold">{availabilityData.availableHours}h</div>
                <div className="text-sm text-muted-foreground">Available</div>
              </div>
              <div className="text-center p-3 border rounded-lg">
                <div className="text-2xl font-bold">{availabilityData.bookedHours}h</div>
                <div className="text-sm text-muted-foreground">Booked</div>
              </div>
              <div className="text-center p-3 border rounded-lg">
                <div className={`text-2xl font-bold ${getAvailabilityColor(availabilityData.utilizationRate)}`}>
                  {Math.round(availabilityData.utilizationRate)}%
                </div>
                <div className="text-sm text-muted-foreground">Utilization</div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Space Utilization</span>
                <span className={getAvailabilityColor(availabilityData.utilizationRate)}>
                  {getAvailabilityStatus(availabilityData.utilizationRate)}
                </span>
              </div>
              <Progress value={availabilityData.utilizationRate} className="h-2" />
            </div>

            {/* Today's Bookings */}
            {availabilityData.bookings && availabilityData.bookings.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-medium text-sm">Today's Bookings:</h4>
                <div className="space-y-2">
                  {availabilityData.bookings.map((booking: any) => (
                    <div key={booking.id} className="flex items-center justify-between p-2 bg-muted rounded-lg">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">{booking.userName}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">
                          {booking.startTime} • {booking.duration}h
                        </span>
                        <Badge variant="outline" className="text-xs">
                          {booking.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Weekly Overview */}
      {showAvailability && weeklyData && (
        <Card className="transition-all duration-300 hover:shadow-md">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Calendar className="h-5 w-5" />
              Weekly Overview
            </CardTitle>
            <CardDescription>7-day availability forecast</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2">
              {weeklyData.map((day: any, index: number) => (
                <div key={day.date} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="text-center min-w-[3rem]">
                      <div className="text-sm font-medium">{day.dayName}</div>
                      <div className="text-xs text-muted-foreground">{format(new Date(day.date), "MMM d")}</div>
                    </div>
                    <Separator orientation="vertical" className="h-8" />
                    <div className="flex-1">
                      <div className="flex justify-between text-sm mb-1">
                        <span>{day.availableHours}h available</span>
                        <span className={getAvailabilityColor(day.utilizationRate)}>
                          {Math.round(day.utilizationRate)}%
                        </span>
                      </div>
                      <Progress value={day.utilizationRate} className="h-1.5" />
                    </div>
                  </div>
                  <Badge
                    variant={
                      day.utilizationRate >= 90 ? "destructive" : day.utilizationRate >= 70 ? "default" : "secondary"
                    }
                    className="text-xs"
                  >
                    {getAvailabilityStatus(day.utilizationRate)}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Loading State */}
      {isChecking && (
        <Card>
          <CardContent className="py-8">
            <div className="flex items-center justify-center space-x-2">
              <RefreshCw className="h-5 w-5 animate-spin" />
              <span className="text-sm text-muted-foreground">
                {type === "event" ? "Checking for conflicts..." : "Checking availability..."}
              </span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
