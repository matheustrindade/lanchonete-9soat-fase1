import HttpServer from "../http/HttpServer";
import { ProductRepository } from "@/application/repository/Product";
import { EventPublisher } from "@/application/event/EventPublisher";
import { ShoppingCartRepository } from "@/application/repository/ShoppingCart";
import { AddProductToShoppingCartUseCase } from "@/application/usecase/AddProductToShoppingCart";
import { CheckoutShoppingCartUseCase } from "@/application/usecase/CheckoutShoppingCart";
import { PaymentGateway } from "@/application/gateway/Payment";
import { OrderRepository } from "@/application/repository/Order";
import { ShoppingCartQuery } from "../projection/ShoppingCart";

export class ShoppingCartController {
  static registerRoutes(
    httpServer: HttpServer, 
    productRepository: ProductRepository, 
    shoppingCartRepository: ShoppingCartRepository, 
    eventPublisher: EventPublisher, 
    paymentGateway: PaymentGateway, 
    orderRepository: OrderRepository, 
    shoppingCartQuery: ShoppingCartQuery
  ) {
    const addProductToShoppingCartUseCase = new AddProductToShoppingCartUseCase(
      productRepository,
      shoppingCartRepository,
      eventPublisher
    );
    const checkoutShoppingCartUseCase = new CheckoutShoppingCartUseCase(
      shoppingCartRepository,
      paymentGateway,
      orderRepository,
      eventPublisher
    )

    httpServer.post("/shopping-cart/items", (request) => {
      return addProductToShoppingCartUseCase.execute({
        productId: request.body.productId,
        quantity: request.body.quantity,
        observation: request.body.observation,
        customerId: request.body.customerId,
      });
    });

    httpServer.post("/shopping-cart/checkout", (request) => {
      return checkoutShoppingCartUseCase.execute({
        customerId: request.body.customerId,
      });
    });

    httpServer.get("/shopping-cart", (request) => {
      return shoppingCartQuery.findByCustomerId(request.params.customerId);
    });
  }
}
