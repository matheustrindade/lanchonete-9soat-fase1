import { EventPublisher } from "@/application/event";
import { OrderRepository } from "@/application/repository";
import { CompleteOrderPreparation} from "@/application/usecase";
import HttpServer, { ResponseNoContent, ResponseOK } from "../http/HttpServer";

export class OrderController {
  static registerRoutes(
    httpServer: HttpServer,
    orderRepository: OrderRepository,
    eventPublisher: EventPublisher,
  ) {
    const completePreparationUseCase = new CompleteOrderPreparation(
      orderRepository,
      eventPublisher
    );

    httpServer.patch("/orders/:id/ready", (request) => {
      return completePreparationUseCase
        .execute({ orderId: request.params.id })
        .then(ResponseNoContent);
    });
  }
}
