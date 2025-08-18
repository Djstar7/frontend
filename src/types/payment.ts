type PaymentMethod = 'mtn' | 'orange' | 'visa' | 'paypal'
type Currency =
  | 'XAF'
  | 'USD'
  | 'EUR'
  | 'GBP'
  | 'CAD'
  | 'NGN'
  | 'AUD'
  | 'JPY'
  | 'CHF'
  | 'CNY'
  | 'GHS'
  | 'ZAR'
  | 'KES'
  | 'UGX'
  | 'TZS'
  | 'EGP'
  | 'SAR'
  | 'AED'
type StatusPayment = 'pending' | 'completed' | 'failed'

interface Payment {
  visa_request_id: number
  amount: number
  transaction_id: string
  method: PaymentMethod
  currency: Currency
  status: StatusPayment
}

export type { Payment, PaymentMethod, Currency, StatusPayment }
