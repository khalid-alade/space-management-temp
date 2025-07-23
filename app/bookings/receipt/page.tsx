"use client"

import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Download, ArrowLeft, CheckCircle } from "lucide-react"
import { toast } from "@/components/ui/use-toast"

interface ReceiptData {
  id: string
  bookingId: string
  customerName: string
  customerEmail: string
  spaceName: string
  bookingType: string
  date: string
  duration: number
  amount: number
  tax: number
  total: number
  status: string
  paymentMethod: string
  transactionId: string
  issuedDate: string
}

export default function ReceiptPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const bookingId = searchParams.get("id")
  const [receipt, setReceipt] = useState<ReceiptData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (bookingId) {
      // Simulate API call to fetch receipt data
      setTimeout(() => {
        const mockReceipt: ReceiptData = {
          id: `RCP-${bookingId}`,
          bookingId: bookingId,
          customerName: "Demo User",
          customerEmail: "demo@nithub.com",
          spaceName: "Flex Pass",
          bookingType: "Coworking Space",
          date: "2024-01-15",
          duration: 30,
          amount: 50000,
          tax: 3750,
          total: 53750,
          status: "Paid",
          paymentMethod: "Credit Card",
          transactionId: `TXN-${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
          issuedDate: new Date().toISOString(),
        }
        setReceipt(mockReceipt)
        setIsLoading(false)
      }, 1000)
    } else {
      router.push("/bookings")
    }
  }, [bookingId, router])

  const downloadPDF = () => {
    // In a real app, this would generate and download a PDF
    toast({
      title: "PDF Downloaded",
      description: "Your receipt has been downloaded as a PDF file.",
    })
  }

  const printReceipt = () => {
    window.print()
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-muted rounded w-1/3"></div>
            <div className="h-96 bg-muted rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!receipt) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-2xl font-bold mb-4">Receipt Not Found</h1>
          <p className="text-muted-foreground mb-4">The receipt you're looking for doesn't exist.</p>
          <Button onClick={() => router.push("/bookings")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Bookings
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <Button variant="outline" onClick={() => router.push("/bookings")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Bookings
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" onClick={printReceipt}>
              Print
            </Button>
            <Button onClick={downloadPDF}>
              <Download className="mr-2 h-4 w-4" />
              Download PDF
            </Button>
          </div>
        </div>

        <Card className="print:shadow-none">
          <CardHeader className="text-center border-b">
            <div className="flex items-center justify-center mb-4">
              {/* <span className="text-2xl font-bold bg-clip-text text-transparent nithub-gradient">NITHUB</span> */}
              <img src="https://res.cloudinary.com/dw3ublxm7/image/upload/f_auto,q_auto,c_fill,g_auto/v1743093874/twnegwbridcqompdoteo.png"
                className="max-w-28 invert sepia-0 saturate-0 contrast-100 dark:invert-0 dark:sepia-0 dark:saturate-100 dark:contrast-100"
                alt="Nithub logo" />
            </div>
            <CardTitle className="text-2xl">Payment Receipt</CardTitle>
            <div className="flex items-center justify-center gap-2 mt-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                {receipt.status}
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="p-6">
            {/* Receipt Header */}
            <div className="grid gap-4 md:grid-cols-2 mb-6">
              <div>
                <h3 className="font-semibold mb-2">Receipt Details</h3>
                <p className="text-sm text-muted-foreground">Receipt ID: {receipt.id}</p>
                <p className="text-sm text-muted-foreground">Booking ID: {receipt.bookingId}</p>
                <p className="text-sm text-muted-foreground">
                  Issued: {new Date(receipt.issuedDate).toLocaleDateString()}
                </p>
                <p className="text-sm text-muted-foreground">Transaction ID: {receipt.transactionId}</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Customer Information</h3>
                <p className="text-sm text-muted-foreground">{receipt.customerName}</p>
                <p className="text-sm text-muted-foreground">{receipt.customerEmail}</p>
              </div>
            </div>

            <Separator className="my-6" />

            {/* Booking Details */}
            <div className="mb-6">
              <h3 className="font-semibold mb-4">Booking Details</h3>
              <div className="bg-muted/50 p-4 rounded-lg">
                <div className="grid gap-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Service:</span>
                    <span className="text-sm font-medium">{receipt.spaceName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Type:</span>
                    <span className="text-sm font-medium">{receipt.bookingType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Date:</span>
                    <span className="text-sm font-medium">{new Date(receipt.date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Duration:</span>
                    <span className="text-sm font-medium">
                      {receipt.duration} {receipt.bookingType.includes("Coworking") ? "days" : "hours"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Payment Method:</span>
                    <span className="text-sm font-medium">{receipt.paymentMethod}</span>
                  </div>
                </div>
              </div>
            </div>

            <Separator className="my-6" />

            {/* Payment Breakdown */}
            <div className="mb-6">
              <h3 className="font-semibold mb-4">Payment Breakdown</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>₦{receipt.amount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax (7.5%):</span>
                  <span>₦{receipt.tax.toLocaleString()}</span>
                </div>
                <Separator />
                <div className="flex justify-between text-lg font-semibold">
                  <span>Total Paid:</span>
                  <span>₦{receipt.total.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <Separator className="my-6" />

            {/* Footer */}
            <div className="text-center text-sm text-muted-foreground">
              <p className="mb-2">Thank you for choosing Nithub!</p>
              <p>For support, contact us at support@nithub.com or +234 123 456 7890</p>
              <p className="mt-4">
                Nithub Technology Innovation Hub
                <br />
                University of Lagos, Akoka, Lagos, Nigeria
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
