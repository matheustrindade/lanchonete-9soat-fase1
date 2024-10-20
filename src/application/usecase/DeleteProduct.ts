import { EventPublisher } from "@/application/event/EventPublisher"
import { NewProductDeletedEvent } from "@/application/event/Product"
import { ProductRepository } from "@/application/repository/Product"
import { ProductNotFoundError } from "@/application/error/Product"

export class DeleteProductUseCase {
  constructor(
    private productRepository: ProductRepository,
    private eventPublisher: EventPublisher
  ) {}

  async execute(input: Input): Promise<void> {
      const product = await this.productRepository.findById(input.productId)
      if (!product) throw ProductNotFoundError
      await this.productRepository.delete(product)
      await this.eventPublisher.publish(NewProductDeletedEvent(product))
  }
}

export type Input = {
  productId: string
}