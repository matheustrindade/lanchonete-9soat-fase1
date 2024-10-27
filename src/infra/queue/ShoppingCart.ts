import { EventConsumer } from "../event/Consumer";
import { ShoppingCartRepository } from "@/application/repository/ShoppingCart";

export class ShoppingCartConsumer {
  static registerConsumers(
    consumer: EventConsumer,
    shoppingCartRepository: ShoppingCartRepository,
  ) {
    consumer.consume('DELETE_SHOPPING_CART', event => {
      return shoppingCartRepository.deleteByCustomerId(event.customerId)
    })
  }
}