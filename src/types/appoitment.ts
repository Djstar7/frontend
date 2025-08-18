type StatusAppt = 'pending' | 'completed' | 'rescheduled' | 'canceled'
interface Appoitment {
  visa_request_id: number
  scheduled_at: string // ISO date string
  location: string
  status: StatusAppt
}

export type { Appoitment, StatusAppt }
