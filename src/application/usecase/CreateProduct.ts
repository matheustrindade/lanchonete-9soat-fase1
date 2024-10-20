import { EventPublisher } from "@/application/event/EventPublisher"
import { NewProductCreatedEvent } from "@/application/event/Product"
import { ProductRepository } from "@/application/repository/Product"
import { Product } from "@/domain/entity/Product"

export class CreateProductUseCase {
  constructor(
    private productRepository: ProductRepository,
    private eventPublisher: EventPublisher
  ) {}

  async execute(input: Input): Promise<Output> {
      const product = Product.create(input.name, input.description, input.price, input.category)
      await this.productRepository.create(product)
      await this.eventPublisher.publish(NewProductCreatedEvent(product))
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
  name: string
  description: string
  price: number
  category: string
}

export type Output = {
  id: string
  name: string
  description: string
  price: number
  category: string
}