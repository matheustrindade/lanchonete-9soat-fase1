import { ProductRepository } from "@/application/repository"
import { ProductNotFoundError } from "@/application/error"
import { EventPublisher, NewProductDeletedEvent } from "@/application/event"

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

type Input = {
  productId: string
}