"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  Smartphone,
  Wifi,
  CreditCard,
  CheckCircle,
  XCircle,
  RefreshCw,
  Zap,
  Shield,
  Clock,
  Battery,
  AlertTriangle,
} from "lucide-react"
import { useNFC } from "@/hooks/use-nfc"

interface NFCPaymentProps {
  amount: number
  description: string
  bookingId?: string
  onPaymentSuccess?: (transactionId: string) => void
  onPaymentError?: (error: string) => void
}

export function NFCPayment({ amount, description, bookingId, onPaymentSuccess, onPaymentError }: NFCPaymentProps) {
  const {
    isNFCSupported,
    isNFCEnabled,
    isScanning,
    isProcessing,
    connectedDevices,
    transactions,
    startNFCScanning,
    stopNFCScanning,
    enableNFC,
    disableNFC,
    refreshDevices,
  } = useNFC()

  const [showDevices, setShowDevices] = useState(false)

  const handleStartPayment = async () => {
    const paymentData = {
      amount,
      currency: "NGN",
      description,
      bookingId,
    }

    const success = await startNFCScanning(paymentData)
    if (success) {
      // Payment process started successfully
    }
  }

  const handlePaymentComplete = (transactionId: string) => {
    onPaymentSuccess?.(transactionId)
  }

  const getBatteryColor = (level: number) => {
    if (level > 60) return "text-green-600"
    if (level > 30) return "text-yellow-600"
    return "text-red-600"
  }

  const getDeviceStatusColor = (isConnected: boolean) => {
    return isConnected ? "text-green-600" : "text-red-600"
  }

  return (
    <div className="space-y-4">
      {/* NFC Payment Card */}
      <Card className="transition-all duration-300 hover:shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Smartphone className="h-5 w-5" />
            NFC Quick Payment
            {isNFCEnabled && (
              <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                <Wifi className="h-3 w-3 mr-1" />
                Enabled
              </Badge>
            )}
          </CardTitle>
          <CardDescription>Tap your NFC-enabled card or device to pay instantly</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!isNFCSupported ? (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>NFC is not supported on this device.</AlertDescription>
            </Alert>
          ) : !isNFCEnabled ? (
            <div className="space-y-4">
              <Alert>
                <Smartphone className="h-4 w-4" />
                <AlertDescription>Enable NFC to use quick payments.</AlertDescription>
              </Alert>
              <Button onClick={enableNFC} className="w-full">
                <Wifi className="mr-2 h-4 w-4" />
                Enable NFC
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Payment Amount */}
              <div className="p-4 bg-muted rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Amount to Pay</p>
                    <p className="text-2xl font-bold">₦{amount.toLocaleString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Description</p>
                    <p className="font-medium">{description}</p>
                  </div>
                </div>
              </div>

              {/* NFC Scanning Interface */}
              {isScanning || isProcessing ? (
                <div className="text-center py-8">
                  <div className="relative mx-auto w-24 h-24 mb-4">
                    <div className="absolute inset-0 border-4 border-primary rounded-full nfc-pulse"></div>
                    <div className="absolute inset-2 border-2 border-primary/50 rounded-full"></div>
                    <div className="absolute inset-4 border border-primary/25 rounded-full"></div>
                    <Smartphone className="absolute inset-0 m-auto h-8 w-8 text-primary" />
                    {isScanning && (
                      <div className="absolute inset-0 border-t-2 border-primary rounded-full nfc-scan-line"></div>
                    )}
                  </div>

                  {isProcessing ? (
                    <div className="space-y-2">
                      <h3 className="text-lg font-medium">Processing Payment...</h3>
                      <p className="text-muted-foreground">Please wait while we process your transaction</p>
                      <Progress value={75} className="w-48 mx-auto" />
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <h3 className="text-lg font-medium">Ready to Scan</h3>
                      <p className="text-muted-foreground">Tap your NFC card or device to the reader</p>
                      <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                        <Wifi className="h-4 w-4" />
                        <span>Scanning for NFC devices...</span>
                      </div>
                    </div>
                  )}

                  <Button variant="outline" onClick={stopNFCScanning} className="mt-4">
                    Cancel Payment
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <Button onClick={handleStartPayment} className="w-full" size="lg">
                    <Zap className="mr-2 h-4 w-4" />
                    Pay with NFC
                  </Button>

                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4 text-green-600" />
                      <span className="text-muted-foreground">Secure Payment</span>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => setShowDevices(true)}>
                      View Devices
                    </Button>
                  </div>
                </div>
              )}

              {/* Quick Actions */}
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={refreshDevices} className="flex-1">
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Refresh
                </Button>
                <Button variant="outline" size="sm" onClick={disableNFC} className="flex-1">
                  <XCircle className="mr-2 h-4 w-4" />
                  Disable NFC
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent NFC Transactions */}
      {transactions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Recent NFC Payments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {transactions.slice(0, 3).map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-full">
                      <CreditCard className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">₦{transaction.amount.toLocaleString()}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(transaction.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <Badge
                    variant={
                      transaction.status === "completed"
                        ? "secondary"
                        : transaction.status === "pending"
                          ? "default"
                          : "destructive"
                    }
                  >
                    {transaction.status === "completed" && <CheckCircle className="h-3 w-3 mr-1" />}
                    {transaction.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* NFC Devices Dialog */}
      <Dialog open={showDevices} onOpenChange={setShowDevices}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>NFC Devices</DialogTitle>
            <DialogDescription>Manage your connected NFC payment devices</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {connectedDevices.map((device) => (
              <div key={device.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-muted rounded-full">
                    <Smartphone className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-medium">{device.name}</p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span className={getDeviceStatusColor(device.isConnected)}>
                        {device.isConnected ? "Connected" : "Disconnected"}
                      </span>
                      {device.batteryLevel && (
                        <>
                          <span>•</span>
                          <Battery className={`h-3 w-3 ${getBatteryColor(device.batteryLevel)}`} />
                          <span className={getBatteryColor(device.batteryLevel)}>{device.batteryLevel}%</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <Badge variant={device.isConnected ? "secondary" : "outline"}>
                  {device.isConnected ? "Active" : "Offline"}
                </Badge>
              </div>
            ))}

            <Separator />

            <div className="flex gap-2">
              <Button variant="outline" onClick={refreshDevices} className="flex-1">
                <RefreshCw className="mr-2 h-4 w-4" />
                Refresh
              </Button>
              <Button onClick={() => setShowDevices(false)} className="flex-1">
                Close
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
