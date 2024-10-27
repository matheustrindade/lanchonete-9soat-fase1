import { EventConsumer } from "../event/Consumer";
import { EventPublisher } from "@/application/event";
import { PaymentGateway } from "@/application/gateway";
import { CheckPaymentStatusUseCase } from "@/application/usecase";
import { PreOrderRepository, OrderRepository } from "@/application/repository";

export class CallbackConsumer {
  static registerConsumers(
    consumer: EventConsumer,
    preOrderRepository: PreOrderRepository,
    paymentGateway: PaymentGateway,
    orderRepository: OrderRepository,
    eventPublisher: EventPublisher
  ) {
    const checkPaymentStatusUseCase = new CheckPaymentStatusUseCase(
      preOrderRepository,
      paymentGateway,
      orderRepository,
      eventPublisher
    )
    consumer.consume('CHECK_PAYMENT_STATUS', event => {
      return checkPaymentStatusUseCase.execute({ internalId: event.internalId })
    })
  }
}