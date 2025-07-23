export interface UserBooking {
  id: string
  type: "coworking" | "event"
  spaceName: string
  date: string
  duration: number
  amount: number
  status: "confirmed" | "pending" | "completed" | "cancelled"
  description?: string
  receiptUrl?: string
  createdAt: string
  updatedAt: string
}

export const userBookings: UserBooking[] = [
  {
    id: "BK001",
    type: "coworking",
    spaceName: "Flex Pass",
    date: "2024-01-15",
    duration: 30,
    amount: 50000,
    status: "confirmed",
    description: "Monthly coworking membership",
    receiptUrl: "/receipts/BK001.pdf",
    createdAt: "2024-01-10T10:00:00.000Z",
    updatedAt: "2024-01-10T10:00:00.000Z",
  },
  {
    id: "BK002",
    type: "event",
    spaceName: "Conference Hall",
    date: "2024-01-20",
    duration: 4,
    amount: 100000,
    status: "completed",
    description: "Product launch event",
    receiptUrl: "/receipts/BK002.pdf",
    createdAt: "2024-01-15T14:30:00.000Z",
    updatedAt: "2024-01-20T18:00:00.000Z",
  },
  {
    id: "BK003",
    type: "coworking",
    spaceName: "Day Pass",
    date: "2024-01-25",
    duration: 1,
    amount: 5000,
    status: "pending",
    description: "Single day access",
    createdAt: "2024-01-24T09:15:00.000Z",
    updatedAt: "2024-01-24T09:15:00.000Z",
  },
]
