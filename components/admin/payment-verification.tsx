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
import {
  CheckCircle,
  XCircle,
  Clock,
  Search,
  Filter,
  Eye,
  CreditCard,
  AlertTriangle,
  Download,
  RefreshCw,
} from "lucide-react"
import { toast } from "@/components/ui/use-toast"

interface Payment {
  id: string
  userId: string
  userName: string
  userEmail: string
  bookingId: string
  amount: number
  method: "card" | "transfer" | "cash" | "nfc"
  status: "pending" | "verified" | "rejected"
  createdAt: string
  reference?: string
  description: string
  attachments?: string[]
}

export function PaymentVerification() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null)

  // Mock payment data
  const [payments, setPayments] = useState<Payment[]>([
    {
      id: "PAY-001",
      userId: "user-1",
      userName: "John Doe",
      userEmail: "john@example.com",
      bookingId: "BK-001",
      amount: 50000,
      method: "transfer",
      status: "pending",
      createdAt: "2024-01-30T10:30:00Z",
      reference: "TXN-123456789",
      description: "Flex Pass - Monthly coworking membership",
      attachments: ["receipt-1.jpg", "bank-statement.pdf"],
    },
    {
      id: "PAY-002",
      userId: "user-2",
      userName: "Jane Smith",
      userEmail: "jane@example.com",
      bookingId: "BK-002",
      amount: 100000,
      method: "card",
      status: "verified",
      createdAt: "2024-01-30T09:15:00Z",
      reference: "CARD-987654321",
      description: "Conference Hall - 4 hours event booking",
    },
    {
      id: "PAY-003",
      userId: "user-3",
      userName: "Mike Johnson",
      userEmail: "mike@example.com",
      bookingId: "BK-003",
      amount: 25000,
      method: "transfer",
      status: "pending",
      createdAt: "2024-01-30T08:45:00Z",
      reference: "TXN-555666777",
      description: "Training Room - 6 hours workshop",
      attachments: ["payment-proof.jpg"],
    },
    {
      id: "PAY-004",
      userId: "user-4",
      userName: "Sarah Wilson",
      userEmail: "sarah@example.com",
      bookingId: "BK-004",
      amount: 5000,
      method: "nfc",
      status: "verified",
      createdAt: "2024-01-29T16:20:00Z",
      reference: "NFC-111222333",
      description: "Day Pass - Single day access",
    },
    {
      id: "PAY-005",
      userId: "user-5",
      userName: "David Brown",
      userEmail: "david@example.com",
      bookingId: "BK-005",
      amount: 75000,
      method: "transfer",
      status: "rejected",
      createdAt: "2024-01-29T14:10:00Z",
      reference: "TXN-888999000",
      description: "Meeting Room - 8 hours conference",
    },
  ])

  const filteredPayments = payments.filter((payment) => {
    const matchesSearch =
      payment.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.reference?.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || payment.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const verifyPayment = (paymentId: string) => {
    setPayments((prev) =>
      prev.map((payment) => (payment.id === paymentId ? { ...payment, status: "verified" as const } : payment)),
    )

    toast({
      title: "Payment Verified",
      description: `Payment ${paymentId} has been successfully verified.`,
    })
  }

  const rejectPayment = (paymentId: string) => {
    setPayments((prev) =>
      prev.map((payment) => (payment.id === paymentId ? { ...payment, status: "rejected" as const } : payment)),
    )

    toast({
      title: "Payment Rejected",
      description: `Payment ${paymentId} has been rejected.`,
      variant: "destructive",
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "verified":
        return "secondary"
      case "rejected":
        return "destructive"
      case "pending":
        return "outline"
      default:
        return "outline"
    }
  }

  const getMethodIcon = (method: string) => {
    switch (method) {
      case "card":
        return <CreditCard className="h-4 w-4" />
      case "transfer":
        return <RefreshCw className="h-4 w-4" />
      case "nfc":
        return <CreditCard className="h-4 w-4" />
      case "cash":
        return <CreditCard className="h-4 w-4" />
      default:
        return <CreditCard className="h-4 w-4" />
    }
  }

  const pendingCount = payments.filter((p) => p.status === "pending").length
  const verifiedCount = payments.filter((p) => p.status === "verified").length
  const rejectedCount = payments.filter((p) => p.status === "rejected").length

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Verification</CardTitle>
            <Clock className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingCount}</div>
            <p className="text-xs text-muted-foreground">Awaiting review</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Verified Today</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{verifiedCount}</div>
            <p className="text-xs text-muted-foreground">Successfully processed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rejected</CardTitle>
            <XCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{rejectedCount}</div>
            <p className="text-xs text-muted-foreground">Requires attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Amount</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₦{payments.reduce((sum, p) => sum + p.amount, 0).toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">All payments</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Payment Verification
          </CardTitle>
          <CardDescription>Review and verify user payments</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search payments..."
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
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="verified">Verified</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Payments List */}
          <div className="space-y-4">
            {filteredPayments.length === 0 ? (
              <div className="text-center py-8">
                <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-medium mb-2">No payments found</h3>
                <p className="text-muted-foreground">
                  {searchTerm || statusFilter !== "all"
                    ? "Try adjusting your filters to see more results."
                    : "No payments to review at this time."}
                </p>
              </div>
            ) : (
              filteredPayments.map((payment) => (
                <div
                  key={payment.id}
                  className="flex items-center justify-between p-4 border rounded-lg transition-all duration-200 hover:shadow-md"
                >
                  <div className="flex items-center space-x-4">
                    <div className="p-2 bg-muted rounded-full">{getMethodIcon(payment.method)}</div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{payment.userName}</p>
                        <Badge variant="outline" className="text-xs">
                          {payment.method.toUpperCase()}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{payment.userEmail}</p>
                      <p className="text-sm text-muted-foreground">
                        {payment.id} • {payment.reference}
                      </p>
                      <p className="text-sm">{payment.description}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className="font-medium">₦{payment.amount.toLocaleString()}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(payment.createdAt).toLocaleDateString()}
                      </p>
                    </div>

                    <Badge variant={getStatusColor(payment.status) as any}>
                      {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                    </Badge>

                    <div className="flex items-center gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm" onClick={() => setSelectedPayment(payment)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[600px]">
                          <DialogHeader>
                            <DialogTitle>Payment Details - {payment.id}</DialogTitle>
                            <DialogDescription>Review payment information and attachments</DialogDescription>
                          </DialogHeader>
                          {selectedPayment && (
                            <div className="space-y-4">
                              <div className="grid gap-4 md:grid-cols-2">
                                <div>
                                  <label className="text-sm font-medium">Customer</label>
                                  <p className="text-muted-foreground">{selectedPayment.userName}</p>
                                  <p className="text-sm text-muted-foreground">{selectedPayment.userEmail}</p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium">Amount</label>
                                  <p className="text-muted-foreground">₦{selectedPayment.amount.toLocaleString()}</p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium">Payment Method</label>
                                  <p className="text-muted-foreground">{selectedPayment.method.toUpperCase()}</p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium">Reference</label>
                                  <p className="text-muted-foreground">{selectedPayment.reference}</p>
                                </div>
                                <div className="md:col-span-2">
                                  <label className="text-sm font-medium">Description</label>
                                  <p className="text-muted-foreground">{selectedPayment.description}</p>
                                </div>
                              </div>

                              {selectedPayment.attachments && selectedPayment.attachments.length > 0 && (
                                <div>
                                  <label className="text-sm font-medium">Attachments</label>
                                  <div className="space-y-2 mt-2">
                                    {selectedPayment.attachments.map((attachment, index) => (
                                      <div key={index} className="flex items-center justify-between p-2 border rounded">
                                        <span className="text-sm">{attachment}</span>
                                        <Button variant="ghost" size="sm">
                                          <Download className="h-4 w-4" />
                                        </Button>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {selectedPayment.status === "pending" && (
                                <div className="flex gap-2 pt-4">
                                  <Button onClick={() => verifyPayment(selectedPayment.id)} className="flex-1">
                                    <CheckCircle className="mr-2 h-4 w-4" />
                                    Verify Payment
                                  </Button>
                                  <Button
                                    variant="destructive"
                                    onClick={() => rejectPayment(selectedPayment.id)}
                                    className="flex-1"
                                  >
                                    <XCircle className="mr-2 h-4 w-4" />
                                    Reject Payment
                                  </Button>
                                </div>
                              )}
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>

                      {payment.status === "pending" && (
                        <>
                          <Button
                            size="sm"
                            onClick={() => verifyPayment(payment.id)}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="destructive" onClick={() => rejectPayment(payment.id)}>
                            <XCircle className="h-4 w-4" />
                          </Button>
                        </>
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
