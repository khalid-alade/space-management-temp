"use client"

import { useState, useCallback, useEffect } from "react"
import { toast } from "@/components/ui/use-toast"

interface NFCPaymentData {
  amount: number
  currency: string
  description: string
  bookingId?: string
  userId?: string
}

interface NFCDevice {
  id: string
  name: string
  isConnected: boolean
  lastUsed?: string
  batteryLevel?: number
}

interface NFCTransaction {
  id: string
  amount: number
  status: "pending" | "completed" | "failed"
  timestamp: string
  bookingId?: string
  paymentMethod: "nfc"
  deviceId: string
}

export function useNFC() {
  const [isNFCSupported, setIsNFCSupported] = useState(false)
  const [isNFCEnabled, setIsNFCEnabled] = useState(false)
  const [isScanning, setIsScanning] = useState(false)
  const [connectedDevices, setConnectedDevices] = useState<NFCDevice[]>([])
  const [transactions, setTransactions] = useState<NFCTransaction[]>([])
  const [isProcessing, setIsProcessing] = useState(false)

  // Check NFC support on component mount
  useEffect(() => {
    checkNFCSupport()
    loadMockDevices()
    loadMockTransactions()
  }, [])

  const checkNFCSupport = useCallback(() => {
    // Check if Web NFC API is supported
    if ("NDEFReader" in window) {
      setIsNFCSupported(true)
      setIsNFCEnabled(true)
    } else {
      // Simulate NFC support for demo purposes
      setIsNFCSupported(true)
      setIsNFCEnabled(true)
      console.log("NFC not natively supported, using simulation mode")
    }
  }, [])

  const loadMockDevices = useCallback(() => {
    const mockDevices: NFCDevice[] = [
      {
        id: "nfc-reader-001",
        name: "Nithub NFC Reader #1",
        isConnected: true,
        lastUsed: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        batteryLevel: 85,
      },
      {
        id: "nfc-reader-002",
        name: "Nithub NFC Reader #2",
        isConnected: true,
        lastUsed: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
        batteryLevel: 92,
      },
      {
        id: "nfc-reader-003",
        name: "Nithub Mobile Reader",
        isConnected: false,
        lastUsed: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        batteryLevel: 45,
      },
    ]
    setConnectedDevices(mockDevices)
  }, [])

  const loadMockTransactions = useCallback(() => {
    const mockTransactions: NFCTransaction[] = [
      {
        id: "nfc-txn-001",
        amount: 5000,
        status: "completed",
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        bookingId: "BK001",
        paymentMethod: "nfc",
        deviceId: "nfc-reader-001",
      },
      {
        id: "nfc-txn-002",
        amount: 25000,
        status: "completed",
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
        bookingId: "BK002",
        paymentMethod: "nfc",
        deviceId: "nfc-reader-002",
      },
    ]
    setTransactions(mockTransactions)
  }, [])

  const startNFCScanning = useCallback(
    async (paymentData: NFCPaymentData) => {
      if (!isNFCSupported) {
        toast({
          title: "NFC Not Supported",
          description: "Your device doesn't support NFC payments.",
          variant: "destructive",
        })
        return false
      }

      setIsScanning(true)
      setIsProcessing(false)

      try {
        // In a real implementation, this would use the Web NFC API
        if ("NDEFReader" in window) {
          const ndef = new (window as any).NDEFReader()
          await ndef.scan()

          ndef.addEventListener("reading", ({ message, serialNumber }: any) => {
            processNFCPayment(paymentData, serialNumber)
          })
        } else {
          // Simulate NFC scanning for demo
          setTimeout(() => {
            const mockSerialNumber = `NFC-${Math.random().toString(36).substring(2, 8).toUpperCase()}`
            processNFCPayment(paymentData, mockSerialNumber)
          }, 3000)
        }

        toast({
          title: "NFC Scanning Started",
          description: "Please tap your NFC-enabled card or device to the reader.",
        })

        return true
      } catch (error) {
        console.error("NFC scanning failed:", error)
        setIsScanning(false)

        toast({
          title: "NFC Scanning Failed",
          description: "Unable to start NFC scanning. Please try again.",
          variant: "destructive",
        })

        return false
      }
    },
    [isNFCSupported],
  )

  const processNFCPayment = useCallback(async (paymentData: NFCPaymentData, deviceId: string) => {
    setIsProcessing(true)

    try {
      // Simulate payment processing
      await new Promise((resolve) => setTimeout(resolve, 2000))

      const transaction: NFCTransaction = {
        id: `nfc-txn-${Date.now()}`,
        amount: paymentData.amount,
        status: "completed",
        timestamp: new Date().toISOString(),
        bookingId: paymentData.bookingId,
        paymentMethod: "nfc",
        deviceId: deviceId,
      }

      setTransactions((prev) => [transaction, ...prev])
      setIsScanning(false)
      setIsProcessing(false)

      toast({
        title: "Payment Successful!",
        description: `₦${paymentData.amount.toLocaleString()} has been charged via NFC.`,
      })

      return transaction
    } catch (error) {
      console.error("NFC payment processing failed:", error)
      setIsScanning(false)
      setIsProcessing(false)

      toast({
        title: "Payment Failed",
        description: "NFC payment could not be processed. Please try again.",
        variant: "destructive",
      })

      throw error
    }
  }, [])

  const stopNFCScanning = useCallback(() => {
    setIsScanning(false)
    setIsProcessing(false)

    toast({
      title: "NFC Scanning Stopped",
      description: "You can restart scanning when ready to pay.",
    })
  }, [])

  const enableNFC = useCallback(async () => {
    try {
      // In a real implementation, this would request NFC permissions
      if ("NDEFReader" in window) {
        const ndef = new (window as any).NDEFReader()
        await ndef.scan()
      }

      setIsNFCEnabled(true)

      toast({
        title: "NFC Enabled",
        description: "NFC payments are now available for quick checkout.",
      })
    } catch (error) {
      console.error("Failed to enable NFC:", error)

      toast({
        title: "NFC Enable Failed",
        description: "Could not enable NFC. Please check your device settings.",
        variant: "destructive",
      })
    }
  }, [])

  const disableNFC = useCallback(() => {
    setIsNFCEnabled(false)
    setIsScanning(false)
    setIsProcessing(false)

    toast({
      title: "NFC Disabled",
      description: "NFC payments have been disabled.",
    })
  }, [])

  const getDeviceStatus = useCallback(
    (deviceId: string) => {
      const device = connectedDevices.find((d) => d.id === deviceId)
      return device || null
    },
    [connectedDevices],
  )

  const refreshDevices = useCallback(async () => {
    // Simulate device refresh
    await new Promise((resolve) => setTimeout(resolve, 1000))
    loadMockDevices()

    toast({
      title: "Devices Refreshed",
      description: "NFC device status has been updated.",
    })
  }, [loadMockDevices])

  return {
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
    getDeviceStatus,
    refreshDevices,
  }
}
