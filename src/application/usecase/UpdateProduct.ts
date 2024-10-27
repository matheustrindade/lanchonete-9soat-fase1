import { ProductRepository } from "@/application/repository"
import { ProductNotFoundError } from "@/application/error"
import { EventPublisher, NewProductUpdatedEvent } from "@/application/event"

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

type Input = {
  productId: string
  name: string
  description: string
  price: number
}

type Output = {
  id: string
  name: string
  description: string
  price: number
  category: string
}