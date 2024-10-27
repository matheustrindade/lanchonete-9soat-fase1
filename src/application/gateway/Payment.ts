import { PaymentTransaction } from "@/domain/entity/Payment";

export interface CreatePixPaymentInput {
  id: string;
  amount: number;
  customer: {
    name: string
    email: string,
  };
}

export interface PaymentGateway {
  createPixPayment(input: CreatePixPaymentInput): Promise<PaymentTransaction>;
  findById(id: string): Promise<PaymentTransaction>;
}
