import { EventPublisher } from "@/application/event/EventPublisher"
import { NewProductUpdatedEvent } from "@/application/event/Product"
import { ProductRepository } from "@/application/repository/Product"
import { ProductNotFoundError } from "@/application/error/Product"

export class UpdateProductUseCase {
  constructor(
    private productRepository: ProductRepository,
    private eventPublisher: EventPublisher
  ) {}

  async execute(input: Input): Promise<Output> {
      const product = await this.productRepository.findById(input.productId)
      if (!product) throw ProductNotFoundError
      product.update(input.name, input.description, input.price)
      await this.productRepository.update(product)
      await this.eventPublisher.publish(NewProductUpdatedEvent(product))
      return {
        id: product.id,
        name: product.getName(),
        description: product.getDescription(),
        price: product.getPrice(),
        category: product.getCategory(),
      }
  }
}

export type Input = {
  productId: string
  name: string
  description: string
  price: number
}

export type Output = {
  id: string
  name: string
  description: string
  price: number
  category: string
}