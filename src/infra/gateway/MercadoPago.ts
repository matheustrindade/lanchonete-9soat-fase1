import { CreatePixPaymentInput,  PaymentGateway} from "@/application/gateway/Payment";
import { PaymentStatus, PaymentTransaction } from "@/domain/entity/Payment";
import { Payment } from "mercadopago";
import { PaymentResponse } from "mercadopago/dist/clients/payment/commonTypes";
import { PaymentCreateData } from "mercadopago/dist/clients/payment/create/types";

const TEN_MINUTES = 600_000

export class MercadoPagoPaymentGateway implements PaymentGateway {
  constructor(readonly payment: Payment, readonly callbackUrl: string){}

  async findById(id: string): Promise<PaymentTransaction> {
    const paymentResponse = await this.payment.get({ id })
    return {
      id: String(paymentResponse.id!!),
      internalId: paymentResponse.metadata.internal_id,
      qrCode: paymentResponse.point_of_interaction?.transaction_data?.qr_code!!,
      qrCodeLink: paymentResponse.point_of_interaction?.transaction_data?.ticket_url!!,
      status: parsePaymentStatus(paymentResponse)
    }
  }

  async createPixPayment(input: CreatePixPaymentInput): Promise<PaymentTransaction> {
    const dateOfExpiration = new Date()
    dateOfExpiration.setUTCMilliseconds(dateOfExpiration.getUTCMilliseconds() + TEN_MINUTES)

    const paymentData: PaymentCreateData = {
      body: {
        transaction_amount: input.amount,
        description: 'Pedido na Lanchonete - FIAP',
        payment_method_id: 'pix',
        date_of_expiration: dateOfExpiration.toISOString(),
        payer: {
          email: input.customer.email,
          first_name: input.customer.name
        },
        metadata: {
          internal_id: input.id
        },
        notification_url: `${this.callbackUrl}/${input.id}`
      }
    }
    const paymentResponse = await this.payment.create(paymentData)
    return {
      id: String(paymentResponse.id!!),
      internalId: input.id,
      qrCode: paymentResponse.point_of_interaction?.transaction_data?.qr_code!!,
      qrCodeLink: paymentResponse.point_of_interaction?.transaction_data?.ticket_url!!,
      status: parsePaymentStatus(paymentResponse)
    }
  }
}

function parsePaymentStatus(paymentResponse: PaymentResponse): PaymentStatus {
  switch(paymentResponse.status) {
    case "pending":
    case "authorized":
    case "in_process":
      return 'PENDING'
    case "rejected":
    case "cancelled":
    case "refunded":
      return 'CANCELLED'
    case "approved":
      return 'PAID'
    default: throw new Error('Invalid status')
  }
}