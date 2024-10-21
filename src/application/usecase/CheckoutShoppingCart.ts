import { PaymentGateway } from "@/application/gateway/Payment";
import { PreOrderRepository } from "@/application/repository/PreOrder";
import { EmptyShoppingCartError } from "@/application/error/ShoppingCart";
import { ShoppingCartRepository } from "@/application/repository/ShoppingCart";
import { EventPublisher } from "@/application/event/EventPublisher";
import { NewPreOrderCreatedEvent } from "@/application/event/PreOrder";
import { Id } from "@/domain/value-objects/Id";

export class CheckoutShoppingCartUseCase {
  constructor(
    private readonly shoppingCartRepository: ShoppingCartRepository,
    private readonly paymentGateway: PaymentGateway,
    private readonly preOrderRepository: PreOrderRepository,
    private readonly eventPublisher: EventPublisher
  ) {}

  async execute(input: Input) : Promise<Output> {
    const shoppingCart = await this.shoppingCartRepository.findByCustomerId(input.customerId)
    if (!shoppingCart) throw EmptyShoppingCartError
    const payment = await this.paymentGateway.createPixPayment({
      id: Id.createString(),
      amount: shoppingCart.getTotalPrice(),
      customer: {
        name: 'Guilherme Silveira', // TODO: Adicionar nome do usuario
        email: '4c283848-7505-49e6-9eb3-d285b8fd9a23@emailhook.site', // TODO: Adicionar email do usuario
      }
    })
    const preOrder = shoppingCart.checkout(payment)
    await this.preOrderRepository.create(preOrder)
    await this.shoppingCartRepository.delete(shoppingCart)
    await this.eventPublisher.publish(NewPreOrderCreatedEvent(preOrder))
    return {
      preOrderId: preOrder.id,
      payment: {
        qrCode: preOrder.payment.qrCode,
        qrCodeLink: preOrder.payment.qrCodeLink,
      }
    }
  }
}

export type Input = {
  customerId: string
}

export type Output = {
  preOrderId: string
  payment: {
    qrCodeLink: string
    qrCode: string
  }
}