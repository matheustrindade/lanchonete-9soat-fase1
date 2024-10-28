import { OrderNotFoundError } from "@/application/error"
import { OrderRepository } from "@/application/repository"
import { EventPublisher, NewOrderFinishedEvent } from "@/application/event"

export class FinishOrder {
  constructor(
    private readonly orderRepository: OrderRepository,
    private readonly eventPublisher: EventPublisher
  ) {}
  
  async execute(input: Input): Promise<void> {
    const order = await this.orderRepository.findById(input.orderId)
    if (!order) throw OrderNotFoundError
    order.finish()
    await this.orderRepository.update(order)
    await this.eventPublisher.publish(NewOrderFinishedEvent(order))
  }
}

type Input = {
  orderId: string
}