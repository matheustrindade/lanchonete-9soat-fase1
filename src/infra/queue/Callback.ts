import { CheckPaymentStatusUseCase } from "@/application/usecase/CheckPaymentStatus";
import { EventConsumer } from "../event/Consumer";
import { PreOrderRepository } from "@/application/repository/PreOrder";
import { PaymentGateway } from "@/application/gateway/Payment";
import { OrderRepository } from "@/application/repository/Order";
import { EventPublisher } from "@/application/event/EventPublisher";

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