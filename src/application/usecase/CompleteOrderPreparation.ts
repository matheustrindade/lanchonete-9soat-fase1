import { OrderNotFoundError } from "@/application/error"
import { OrderRepository } from "@/application/repository"
import { EventPublisher, NewOrderReadyEvent } from "@/application/event"

export class CompleteOrderPreparation {
  constructor(
    private readonly orderRepository: OrderRepository,
    private readonly eventPublisher: EventPublisher
  ) {}
  
  async execute(input: Input): Promise<void> {
    const order = await this.orderRepository.findById(input.orderId)
    if (!order) throw OrderNotFoundError
    order.completePreparation()
    await this.orderRepository.update(order)
    await this.eventPublisher.publish(NewOrderReadyEvent(order))
  }
}

type Input = {
  orderId: string
}