export interface Alert {
  failReason?: string
  userIds?: number[] 
  User?: {
    id: number
    email: string
    name?: string
  }
  id: string
  title: string
  content: string
  type: "system" | "ride_closed" | "ride_resumed" | "event" | "parade"
  recipient: string
  deliveryMethod: "push" | "email"
  scheduledAt?: string
  status: "scheduled" | "sent" | "failed"
  read?: boolean
  createdAt: string

  priority?: "low" | "medium" | "high"
  deliveryTime?: string
  imageUrl?: string
  actionUrl?: string
  tags?: string[]
  errorMessage?: string
  recipientCount?: number
  deliveryStats?: {
    delivered: number
    opened: number
    clicked: number
  }
}