"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { format } from "date-fns"
import { CalendarIcon, CreditCard, CalendarIcon as CalendarSyncIcon, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { cn } from "@/lib/utils"
import { eventSpaces } from "@/data/event-spaces"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
import { useCalendarSync } from "@/hooks/use-calendar-sync"
import { ConflictChecker } from "@/components/conflict-checker"
import { AvailabilityCalendar } from "@/components/availability-calendar"
import { NFCPayment } from "@/components/nfc-payment"

const formSchema = z.object({
  spaceId: z.string().min(1, {
    message: "Please select an event space.",
  }),
  date: z.date({
    required_error: "Please select a date.",
  }),
  startTime: z.string().min(1, {
    message: "Please select a start time.",
  }),
  duration: z.number().min(1, {
    message: "Duration must be at least 1 hour.",
  }),
  attendees: z.number().min(1, {
    message: "Please enter the number of attendees.",
  }),
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  phone: z.string().min(10, {
    message: "Please enter a valid phone number.",
  }),
  eventDescription: z.string().optional(),
  paymentMethod: z.enum(["card", "transfer", "cash", "nfc"], {
    required_error: "Please select a payment method.",
  }),
  syncToCalendar: z.boolean().default(false),
})

const timeSlots = [
  "08:00",
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00",
  "19:00",
  "20:00",
]

export default function BookEventSpacePage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const spaceId = searchParams.get("space") || ""
  const [selectedSpace, setSelectedSpace] = useState(
    eventSpaces.find((space) => space.id === spaceId) || eventSpaces[0],
  )
  const [hasConflict, setHasConflict] = useState(false)
  const [conflictMessage, setConflictMessage] = useState("")
  const [showAvailabilityCalendar, setShowAvailabilityCalendar] = useState(false)

  const { providers, createCalendarEvent } = useCalendarSync()
  const connectedProviders = providers.filter((p) => p.isConnected && p.syncEnabled)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      spaceId: spaceId || eventSpaces[0].id,
      date: new Date(),
      startTime: "09:00",
      duration: 2,
      attendees: 10,
      // name: "",
      // email: "",
      // phone: "",
      eventDescription: "",
      paymentMethod: "card",
      syncToCalendar: connectedProviders.length > 0,
    },
  })

  const handleConflictResult = (conflict: boolean, message?: string) => {
    setHasConflict(conflict)
    setConflictMessage(message || "")
  }

  const handleDateSelect = (date: Date) => {
    form.setValue("date", date)
  }

  const handleTimeSelect = (time: string) => {
    form.setValue("startTime", time)
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (hasConflict) {
      toast({
        title: "Booking Conflict",
        description: "Please resolve scheduling conflicts before proceeding.",
        variant: "destructive",
      })
      return
    }

    // In a real app, this would submit to an API
    console.log(values)

    // Simulate API call
    setTimeout(async () => {
      const bookingId = Math.random().toString(36).substring(2, 10)

      toast({
        title: "Booking Successful!",
        description: "Your event space booking has been confirmed. Check your email for details.",
      })

      // Sync to calendar if requested
      if (values.syncToCalendar && connectedProviders.length > 0) {
        try {
          const bookingData = {
            id: bookingId,
            type: "event" as const,
            spaceName: selectedSpace.name,
            date: values.date.toISOString(),
            duration: values.duration,
            amount: selectedSpace.pricePerHour * values.duration,
            status: "confirmed",
            description: values.eventDescription || `Event at ${selectedSpace.name}`,
          }

          await createCalendarEvent(bookingData, connectedProviders[0].id)
        } catch (error) {
          console.error("Failed to sync to calendar:", error)
        }
      }

      // Redirect to receipt page
      router.push(`/bookings/receipt?id=${bookingId}`)
    }, 1500)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold">Book Event Space</h1>
          <p className="text-muted-foreground">Complete the form below to book your event space</p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_400px]">
          <div className="space-y-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                  control={form.control}
                  name="spaceId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Select Event Space</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={(value) => {
                            field.onChange(value)
                            const space = eventSpaces.find((s) => s.id === value)
                            if (space) setSelectedSpace(space)
                          }}
                          defaultValue={field.value}
                          className="grid grid-cols-1 gap-4"
                        >
                          {eventSpaces.map((space) => (
                            <FormItem key={space.id}>
                              <FormControl>
                                <RadioGroupItem value={space.id} id={space.id} className="peer sr-only" />
                              </FormControl>
                              <FormLabel
                                htmlFor={space.id}
                                className="flex items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                              >
                                <div>
                                  <span className="text-lg font-semibold">{space.name}</span>
                                  <p className="text-sm text-muted-foreground">Capacity: {space.capacity} people</p>
                                </div>
                                <span className="text-sm text-muted-foreground">
                                  ₦{space.pricePerHour.toLocaleString()}/hour
                                </span>
                              </FormLabel>
                            </FormItem>
                          ))}
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid gap-4 md:grid-cols-3">
                  <FormField
                    control={form.control}
                    name="date"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Event Date</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-full pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground",
                                )}
                              >
                                {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={(date) =>
                                date < new Date() || date > new Date(new Date().setMonth(new Date().getMonth() + 6))
                              }
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="startTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Start Time</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select start time" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {timeSlots.map((time) => (
                              <SelectItem key={time} value={time}>
                                {time}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="duration"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Duration (hours)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min={1}
                            max={12}
                            {...field}
                            onChange={(e) => field.onChange(Number.parseInt(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="attendees"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Number of Attendees</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={1}
                          max={selectedSpace.capacity}
                          {...field}
                          onChange={(e) => field.onChange(Number.parseInt(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* <div className="grid gap-4 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input placeholder="John Doe" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="john@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input placeholder="08012345678" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                /> */}

                <FormField
                  control={form.control}
                  name="eventDescription"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Event Description (Optional)</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Describe your event..." className="resize-none" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="paymentMethod"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Payment Method</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex flex-col space-y-1"
                        >
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="card" />
                            </FormControl>
                            <FormLabel className="font-normal">Credit/Debit Card</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="transfer" />
                            </FormControl>
                            <FormLabel className="font-normal">Bank Transfer</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="cash" />
                            </FormControl>
                            <FormLabel className="font-normal">Cash Payment (on arrival)</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="nfc" />
                            </FormControl>
                            <FormLabel className="font-normal">NFC Payment (Tap to Pay)</FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {form.watch("paymentMethod") === "nfc" && (
                  <NFCPayment
                    amount={selectedSpace.pricePerHour * form.watch("duration")}
                    description={`${selectedSpace.name} - ${form.watch("duration")} hours`}
                    bookingId="pending"
                    onPaymentSuccess={(transactionId) => {
                      toast({
                        title: "Payment Successful!",
                        description: "Your event space booking has been confirmed via NFC payment.",
                      })
                      router.push(`/bookings/receipt?id=${transactionId}`)
                    }}
                  />
                )}

                {connectedProviders.length > 0 && (
                  <FormField
                    control={form.control}
                    name="syncToCalendar"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                        <FormControl>
                          <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel className="flex items-center gap-2">
                            <CalendarSyncIcon className="h-4 w-4" />
                            Add to Calendar
                          </FormLabel>
                          <p className="text-sm text-muted-foreground">
                            Automatically add this event to your connected calendar ({connectedProviders[0].name})
                          </p>
                        </div>
                      </FormItem>
                    )}
                  />
                )}

                {hasConflict && (
                  <Alert variant="destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>{conflictMessage}</AlertDescription>
                  </Alert>
                )}

                <div className="flex gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowAvailabilityCalendar(!showAvailabilityCalendar)}
                    className="flex-1"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {showAvailabilityCalendar ? "Hide" : "Show"} Availability
                  </Button>
                  <Button type="submit" className="flex-1" disabled={hasConflict}>
                    <CreditCard className="mr-2 h-4 w-4" />
                    Complete Booking
                  </Button>
                </div>
              </form>
            </Form>

            {/* Availability Calendar */}
            {showAvailabilityCalendar && (
              <AvailabilityCalendar
                spaceId={form.watch("spaceId")}
                spaceName={selectedSpace.name}
                selectedDate={form.watch("date")}
                duration={form.watch("duration")}
                onDateSelect={handleDateSelect}
                onTimeSelect={handleTimeSelect}
              />
            )}
          </div>

          <div className="space-y-6">
            {/* Booking Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Booking Summary</CardTitle>
                <CardDescription>Details of your event booking</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Space:</span>
                  <span className="font-medium">{selectedSpace.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Capacity:</span>
                  <span className="font-medium">{selectedSpace.capacity} people</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Rate:</span>
                  <span className="font-medium">₦{selectedSpace.pricePerHour.toLocaleString()}/hour</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Duration:</span>
                  <span className="font-medium">{form.watch("duration")} hours</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Date:</span>
                  <span className="font-medium">
                    {form.watch("date") ? format(form.watch("date"), "MMM d, yyyy") : "Not selected"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Time:</span>
                  <span className="font-medium">{form.watch("startTime")}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Attendees:</span>
                  <span className="font-medium">{form.watch("attendees")} people</span>
                </div>
                {connectedProviders.length > 0 && form.watch("syncToCalendar") && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Calendar Sync:</span>
                    <span className="font-medium text-green-600">Enabled</span>
                  </div>
                )}
                <div className="border-t pt-4">
                  <div className="flex justify-between font-medium">
                    <span>Total:</span>
                    <span>₦{(selectedSpace.pricePerHour * form.watch("duration")).toLocaleString()}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="text-xs text-muted-foreground">
                <p>All bookings are subject to our terms and conditions.</p>
              </CardFooter>
            </Card>

            {/* Conflict Checker */}
            <ConflictChecker
              spaceId={form.watch("spaceId")}
              spaceName={selectedSpace.name}
              date={form.watch("date")}
              startTime={form.watch("startTime")}
              duration={form.watch("duration")}
              type="event"
              onConflictResult={handleConflictResult}
              showAvailability={true}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
