export type PaymentStatus = 'PENDING' | 'CANCELLED' | 'PAID'

export type PaymentTransaction = {
  id: string
  qrCodeLink: string
  qrCode: string
  status: PaymentStatus
}