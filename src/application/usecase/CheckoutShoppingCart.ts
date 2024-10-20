import { PaymentGateway } from "@/application/gateway/Payment";
import { OrderRepository } from "@/application/repository/Order";
import { EmptyShoppingCartError } from "@/application/error/ShoppingCart";
import { ShoppingCartRepository } from "@/application/repository/ShoppingCart";
import { EventPublisher } from "@/application/event/EventPublisher";
import { NewOrderCreatedEvent } from "@/application/event/Order";

export class CheckoutShoppingCartUseCase {
  constructor(
    private readonly shoppingCartRepository: ShoppingCartRepository,
    private readonly paymentGateway: PaymentGateway,
    private readonly orderRepository: OrderRepository,
    private readonly eventPublisher: EventPublisher
  ) {}

  async execute(input: Input) : Promise<Output> {
    const shoppingCart = await this.shoppingCartRepository.findByCustomerId(input.customerId)
    if (!shoppingCart) throw EmptyShoppingCartError
    const payment = await this.paymentGateway.createPixPayment({
      amount: shoppingCart.getTotalPrice(),
      customer: {
        name: 'Guilherme Silveira', // TODO: Adicionar nome do usuario
        email: '4c283848-7505-49e6-9eb3-d285b8fd9a23@emailhook.site', // TODO: Adicionar email do usuario
      }
    })
    const order = shoppingCart.checkout(payment)
    await this.orderRepository.create(order)
    await this.eventPublisher.publish(NewOrderCreatedEvent(order))
    return {
      orderId: order.id,
      payment: {
        qrCode: order.payment.qrCode,
        qrCodeLink: order.payment.qrCodeLink,
      }
    }
  }
}

export type Input = {
  customerId: string
}

export type Output = {
  orderId: string
  payment: {
    qrCodeLink: string
    qrCode: string
  }
}