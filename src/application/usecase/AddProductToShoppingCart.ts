import { ProductNotFoundError } from "@/application/error/Product"
import { ProductRepository } from "@/application/repository/Product"
import { ShoppingCartRepository } from "@/application/repository/ShoppingCart"
import { EventPublisher } from "@/application/event/EventPublisher"
import { ShoppingCart } from "@/domain/entity/ShoppingCart"
import { NewProductAddedToShoppingCartEvent } from "../event/ShoppingCart"

export class AddProductToShoppingCartUseCase {

  constructor(
    private readonly productRepository: ProductRepository,
    private readonly shoppingCartRepository: ShoppingCartRepository,
    private readonly eventPublisher: EventPublisher
  ) {}

  async execute(input: Input): Promise<void> {
    let shoppingCart = await this.shoppingCartRepository.findByCustomerId(input.customerId)
    if (!shoppingCart) {
      shoppingCart = ShoppingCart.create(input.customerId)
    }
    const product = await this.productRepository.findById(input.productId)
    if (!product) throw ProductNotFoundError
    shoppingCart.addProduct(product, input.quantity, input.observation)
    await this.shoppingCartRepository.save(shoppingCart)
    await this.eventPublisher.publish(NewProductAddedToShoppingCartEvent(product, shoppingCart))
  }
}

export type Input = {
  customerId: string
  productId: string
  quantity: number
  observation: string
}