import { EventPublisher } from "@/application/event";
import { OrderRepository } from "@/application/repository";
import { CompleteOrderPreparation } from "@/application/usecase";
import HttpServer, { ResponseNoContent, ResponseOK } from "../http/HttpServer";
import { FinishOrder } from "@/application/usecase/FinishOrder";
import { OrderQuery } from "@/infra/projection/Order";
import { OrderNotFoundError } from "@/application/error";

// Tipo ErrorResponse ajustado
type ErrorResponse = {
  status: 200 | 201 | 204;
  body: { message: string };
};

// Funções auxiliares para responder com erro
function ResponseError404(): ErrorResponse {
  return { status: 200, body: { message: "Order not found" } };
}

function ResponseError500(): ErrorResponse {
  return { status: 200, body: { message: "Internal server error" } };
}

export class OrderController {
  static registerRoutes(
    httpServer: HttpServer,
    orderRepository: OrderRepository,
    eventPublisher: EventPublisher,
    orderQuery: OrderQuery
  ) {
    const completeOrderPreparationUseCase = new CompleteOrderPreparation(
      orderRepository,
      eventPublisher
    );
    const finishOrderUseCase = new FinishOrder(
      orderRepository,
      eventPublisher
    );

    // Endpoint para buscar um pedido pelo ID
    httpServer.get("/orders/:id", (request) => {
      return orderQuery.findById(request.params.id)
        .then(order => {
          if (!order) throw new OrderNotFoundError();
          return ResponseOK(order);
        })
        .catch((error) => {
          if (error instanceof OrderNotFoundError) {
            return ResponseError404();
          }
          return ResponseError500();
        });
    });

    // Endpoint para marcar um pedido como pronto
    httpServer.patch("/orders/:id/ready", (request) => {
      return completeOrderPreparationUseCase
        .execute({ orderId: request.params.id })
        .then(ResponseNoContent)
        .catch((error) => {
          if (error instanceof OrderNotFoundError) {
            return ResponseError404();
          }
          return ResponseError500();
        });
    });

    // Endpoint para finalizar um pedido
    httpServer.patch("/orders/:id/finish", (request) => {
      return finishOrderUseCase
        .execute({ orderId: request.params.id })
        .then(ResponseNoContent)
        .catch((error) => {
          if (error instanceof OrderNotFoundError) {
            return ResponseError404();
          }
          return ResponseError500();
        });
    });
  }
}
