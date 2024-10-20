import HttpServer from "../http/HttpServer";
import { ProductRepository } from "@/application/repository/Product";
import { EventPublisher } from "@/application/event/EventPublisher";
import { ShoppingCartRepository } from "@/application/repository/ShoppingCart";
import { AddProductToShoppingCartUseCase } from "@/application/usecase/AddProductToShoppingCart";

export class ShoppingCartController {
  static registerRoutes(
    httpServer: HttpServer,
    productRepository: ProductRepository,
    shoppingCartRepository: ShoppingCartRepository,
    eventPublisher: EventPublisher
  ) {
    const addProductToShoppingCartUseCase = new AddProductToShoppingCartUseCase(
      productRepository,
      shoppingCartRepository,
      eventPublisher
    );

    httpServer.post("/shopping-cart/items", (request) => {
      return addProductToShoppingCartUseCase.execute({
        productId: request.body.productId,
        quantity: request.body.quantity,
        observation: request.body.observation,
        customerId: request.body.customerId,
      });
    });
  }
}
