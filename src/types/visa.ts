type StatusVisa = 'pending' | 'approved' | 'rejected'

interface VisaRequest {
  id: number
  user_id: number
  visa_type_id: number
  origin_country_id: number
  destination_country_id: number
  status: StatusVisa
}

export type { VisaRequest, StatusVisa }
