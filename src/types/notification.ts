type StatusNotification = 'sent' | 'delivered' | 'failed'

interface Notification {
  user_id: number
  appoitment_id: number
  type: string // Type of notification (e.g., 'appoitment', 'connexion', 'register', etc.)
  content: string
  status: StatusNotification
}

export type { Notification, StatusNotification }
