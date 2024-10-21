import { PreOrderRepository } from "@/application/repository/PreOrder"
import { PaymentGateway } from "@/application/gateway/Payment"
import { OrderRepository } from "@/application/repository/Order"
import { EventPublisher } from "@/application/event/EventPublisher"
import { NewOrderCreatedEvent } from "@/application/event/Order"
import { Order } from "@/domain/entity/Order"

export class CheckPaymentStatusUseCase {
  constructor(
    private readonly preOrderRepository: PreOrderRepository,
    private readonly paymentGateway: PaymentGateway,
    private readonly orderRepository: OrderRepository,
    private readonly eventPublisher: EventPublisher
  ) {}

  async execute(input: Input): Promise<void> {
    const preOrder = await this.preOrderRepository.findByInternalId(input.internalId)
    if (!preOrder) return
    const payment = await this.paymentGateway.findById(preOrder.payment.id)
    if (payment.status !== 'PAID') return
    const order = Order.create(preOrder.customerId, preOrder.items, preOrder.totalPrice, payment)
    await this.orderRepository.create(order)
    await this.preOrderRepository.delete(preOrder)
    await this.eventPublisher.publish(NewOrderCreatedEvent(order))
  }
}

type Input = {
  internalId: string
}