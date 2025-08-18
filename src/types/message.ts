type StatusMessage = 'sending' | 'sent' | 'read' | 'failed'

interface Message {
  user_id: number
  visa_request_id: number
  subject: string
  content: string
  status: StatusMessage
}

export type { Message, StatusMessage }
