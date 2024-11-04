import { EventConsumer } from "../event/Consumer";
import { ShoppingCartRepository } from "@/application/repository";

export class ShoppingCartConsumer {
  static registerConsumers(
    consumer: EventConsumer,
    shoppingCartRepository: ShoppingCartRepository,
  ) {
    consumer.consume('DELETE_SHOPPING_CART', async event => {
      return await shoppingCartRepository.deleteByCustomerId(event.customerId);
    });
  }
}
