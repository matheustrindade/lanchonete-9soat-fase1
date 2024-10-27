import { Product } from "@/domain/entity";
import { ProductRepository } from "@/application/repository";

export class ListProductsUseCase {
  constructor(private productRepository: ProductRepository) {}

  async execute(input: Input): Promise<Output[]> {
    if (!input.category) throw new Error('The category is required')
    const products = await this.productRepository.listByCategory(input.category);
    return products.map((product: Product) => ({
      id: product.id,
      name: product.getName(),
      description: product.getDescription(),
      price: product.getPrice(),
      category: product.getCategory(),
    }));
  }
}

type Input = {
  category: string;
};

type Output = {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
};
