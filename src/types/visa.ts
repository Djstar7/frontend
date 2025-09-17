import type { StatusMat } from './user'

type StatusVisa = 'pending' | 'approved' | 'rejected'

interface VisaRequest {
  id: number
  user_id: number
  visa_type_id: number
  origin_country_id: number
  destination_country_id: number
  status: StatusVisa
}
interface VisaRequestPayload {
  user_id: number
  country_dest_name: string
  visa_type_name: string
  nationality: string
}
interface VisaType {
  id: number
  name: string
  description?: string
}
interface Visa {
  user_id: number
  country_dest_name: string
  visa_type_name: string
}
interface VisaFetch {
  user_id?: number
  country_name: string
  visa_type_name: string
  price_base: number | null
  price_per_child: number | null
  processing_duration_min: number | null
  processing_duration_max: number | null
  status_mat: StatusMat
  age: number | null
  documents: string[]
}
export type { VisaRequest, VisaType, Visa, VisaFetch, VisaRequestPayload }
