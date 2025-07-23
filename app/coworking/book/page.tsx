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
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { cn } from "@/lib/utils"
import { coworkingPlans } from "@/data/coworking-plans"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/use-toast"
import { useCalendarSync } from "@/hooks/use-calendar-sync"
import { ConflictChecker } from "@/components/conflict-checker"
import { NFCPayment } from "@/components/nfc-payment"

const formSchema = z.object({
  planId: z.string().min(1, {
    message: "Please select a plan.",
  }),
  startDate: z.date({
    required_error: "Please select a start date.",
  }),
  duration: z.number().min(1, {
    message: "Duration must be at least 1.",
  }),
  // name: z.string().min(2, {
  //   message: "Name must be at least 2 characters.",
  // }),
  // email: z.string().email({
  //   message: "Please enter a valid email address.",
  // }),
  // phone: z.string().min(10, {
  //   message: "Please enter a valid phone number.",
  // }),
  paymentMethod: z.enum(["card", "transfer", "cash", "nfc"], {
    required_error: "Please select a payment method.",
  }),
  syncToCalendar: z.boolean().default(false),
})

export default function BookCoworkingPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const planId = searchParams.get("plan") || ""
  const [selectedPlan, setSelectedPlan] = useState(
    coworkingPlans.find((plan) => plan.id === planId) || coworkingPlans[0],
  )
  const [hasConflict, setHasConflict] = useState(false)
  const [conflictMessage, setConflictMessage] = useState("")

  const { providers, createCalendarEvent } = useCalendarSync()
  const connectedProviders = providers.filter((p) => p.isConnected && p.syncEnabled)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      planId: planId || coworkingPlans[0].id,
      startDate: new Date(),
      duration: 1,
      // name: "",
      // email: "",
      // phone: "",
      paymentMethod: "card",
      syncToCalendar: connectedProviders.length > 0,
    },
  })

  const handleConflictResult = (conflict: boolean, message?: string) => {
    setHasConflict(conflict)
    setConflictMessage(message || "")
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (hasConflict) {
      toast({
        title: "Booking Conflict",
        description: "Please resolve availability issues before proceeding.",
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
        description: "Your booking has been confirmed. Check your email for details.",
      })

      // Sync to calendar if requested
      if (values.syncToCalendar && connectedProviders.length > 0) {
        try {
          const bookingData = {
            id: bookingId,
            type: "coworking" as const,
            spaceName: selectedPlan.name,
            date: values.startDate.toISOString(),
            duration: values.duration,
            amount: selectedPlan.price * values.duration,
            status: "confirmed",
            description: `${selectedPlan.name} - ${values.duration} ${selectedPlan.interval}${values.duration > 1 ? "s" : ""}`,
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
          <h1 className="text-3xl font-bold">Book Coworking Space</h1>
          <p className="text-muted-foreground">Complete the form below to book your coworking space</p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_400px]">
          <div className="space-y-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                  control={form.control}
                  name="planId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Select Plan</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={(value) => {
                            field.onChange(value)
                            const plan = coworkingPlans.find((p) => p.id === value)
                            if (plan) setSelectedPlan(plan)
                          }}
                          defaultValue={field.value}
                          className="grid grid-cols-1 gap-4 md:grid-cols-3"
                        >
                          {coworkingPlans.map((plan) => (
                            <FormItem key={plan.id}>
                              <FormControl>
                                <RadioGroupItem value={plan.id} id={plan.id} className="peer sr-only" />
                              </FormControl>
                              <FormLabel
                                htmlFor={plan.id}
                                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                              >
                                <span className="text-lg font-semibold">{plan.name}</span>
                                <span className="text-sm text-muted-foreground">
                                  ₦{plan.price.toLocaleString()}/{plan.interval}
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

                <div className="grid gap-4 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="startDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Start Date</FormLabel>
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
                                date < new Date() || date > new Date(new Date().setMonth(new Date().getMonth() + 3))
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
                    name="duration"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{selectedPlan.interval === "day" ? "Number of Days" : "Number of Months"}</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min={1}
                            max={selectedPlan.interval === "day" ? 30 : 12}
                            {...field}
                            onChange={(e) => field.onChange(Number.parseInt(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

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
                    amount={selectedPlan.price * form.watch("duration")}
                    description={`${selectedPlan.name} - ${form.watch("duration")} ${form.watch("duration") === 1 ? selectedPlan.interval : `${selectedPlan.interval}s`}`}
                    bookingId="pending"
                    onPaymentSuccess={(transactionId) => {
                      toast({
                        title: "Payment Successful!",
                        description: "Your booking has been confirmed via NFC payment.",
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
                            Automatically add this booking to your connected calendar ({connectedProviders[0].name})
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

                <Button type="submit" className="w-full" disabled={hasConflict}>
                  <CreditCard className="mr-2 h-4 w-4" />
                  Complete Booking
                </Button>
              </form>
            </Form>
          </div>

          <div className="space-y-6">
            {/* Booking Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Booking Summary</CardTitle>
                <CardDescription>Details of your booking</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Plan:</span>
                  <span className="font-medium">{selectedPlan.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Price:</span>
                  <span className="font-medium">
                    ₦{selectedPlan.price.toLocaleString()}/{selectedPlan.interval}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Duration:</span>
                  <span className="font-medium">
                    {form.watch("duration")}{" "}
                    {form.watch("duration") === 1 ? selectedPlan.interval : `${selectedPlan.interval}s`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Start Date:</span>
                  <span className="font-medium">
                    {form.watch("startDate") ? format(form.watch("startDate"), "MMM d, yyyy") : "Not selected"}
                  </span>
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
                    <span>₦{(selectedPlan.price * form.watch("duration")).toLocaleString()}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="text-xs text-muted-foreground">
                <p>All bookings are subject to our terms and conditions.</p>
              </CardFooter>
            </Card>

            {/* Conflict Checker */}
            <ConflictChecker
              planType={form.watch("planId")}
              date={form.watch("startDate")}
              duration={form.watch("duration")}
              type="coworking"
              onConflictResult={handleConflictResult}
              showAvailability={false}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
