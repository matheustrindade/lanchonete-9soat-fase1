import { PaymentTransaction } from "@/domain/entity/Payment"

export type CreatePixPaymentInput = {
  amount: number
  customer: {
    name: string
    email: string
  }
}

export interface PaymentGateway {
  createPixPayment(input: CreatePixPaymentInput): Promise<PaymentTransaction>
}