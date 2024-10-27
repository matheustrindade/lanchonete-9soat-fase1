import HttpServer, { ResponseOK } from "../http/HttpServer";
import { 
  ProductRepository,
  PreOrderRepository,
  ShoppingCartRepository,
} from "@/application/repository";
import { 
  AddProductToShoppingCartUseCase,
  CheckoutShoppingCartUseCase
} from "@/application/usecase";
import { PaymentGateway } from "@/application/gateway";
import { EventPublisher } from "@/application/event";
import { ShoppingCartQuery } from "../projection/ShoppingCart";

export class ShoppingCartController {
  static registerRoutes(
    httpServer: HttpServer,
    productRepository: ProductRepository,
    shoppingCartRepository: ShoppingCartRepository,
    eventPublisher: EventPublisher,
    paymentGateway: PaymentGateway,
    preOrderRepository: PreOrderRepository,
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
      preOrderRepository,
      eventPublisher
    );

    httpServer.post("/shopping-cart/items", (request) => {
      return addProductToShoppingCartUseCase
        .execute({
          productId: request.body.productId,
          quantity: request.body.quantity,
          observation: request.body.observation,
          customerId: request.body.customerId,
        })
        .then(ResponseOK);
    });

    httpServer.post("/shopping-cart/checkout", (request) => {
      return checkoutShoppingCartUseCase
        .execute({ customerId: request.body.customerId })
        .then(ResponseOK);
    });

    httpServer.get("/shopping-cart", (request) => {
      return shoppingCartQuery
        .findByCustomerId(request.params.customerId)
        .then(ResponseOK);
    });
  }
}
