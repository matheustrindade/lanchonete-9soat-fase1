import { ProductNotFoundError } from "@/application/error";
import { EventPublisher, NewProductAddedToShoppingCartEvent } from "@/application/event";
import { ProductRepository, ShoppingCartRepository } from "@/application/repository";
import { ShoppingCart } from "@/domain/entity";

export class AddProductToShoppingCartUseCase {

  constructor(
    private readonly productRepository: ProductRepository,
    private readonly shoppingCartRepository: ShoppingCartRepository,
    private readonly eventPublisher: EventPublisher,
  ) {}

  public async execute(input: Input): Promise<void> {
    let shoppingCart = await this.shoppingCartRepository.findByCustomerId(input.customerId);
    if (!shoppingCart) {
      shoppingCart = ShoppingCart.create(input.customerId);
    }
    const product = await this.productRepository.findById(input.productId);
    if (!product) { throw ProductNotFoundError; }
    shoppingCart.addProduct(product, input.quantity, input.observation);
    await this.shoppingCartRepository.save(shoppingCart);
    await this.eventPublisher.publish(NewProductAddedToShoppingCartEvent(product, shoppingCart));
  }
}

interface Input {
  customerId: string;
  productId: string;
  quantity: number;
  observation: string;
}
