import { EventPublisher } from "@/application/event";
import { OrderRepository } from "@/application/repository";
import { CompleteOrderPreparation} from "@/application/usecase";
import HttpServer, { ResponseNoContent, ResponseOK } from "../http/HttpServer";
import { FinishOrder } from "@/application/usecase/FinishOrder";

export class OrderController {
  static registerRoutes(
    httpServer: HttpServer,
    orderRepository: OrderRepository,
    eventPublisher: EventPublisher,
  ) {
    const completeOrderPreparationUseCase = new CompleteOrderPreparation(
      orderRepository,
      eventPublisher
    );
    const finishOrderUseCase = new FinishOrder(
      orderRepository,
      eventPublisher
    );

    httpServer.patch("/orders/:id/ready", (request) => {
      return completeOrderPreparationUseCase
        .execute({ orderId: request.params.id })
        .then(ResponseNoContent);
    });

    httpServer.patch("/orders/:id/finish", (request) => {
      return finishOrderUseCase
        .execute({ orderId: request.params.id })
        .then(ResponseNoContent);
    });
  }
}
