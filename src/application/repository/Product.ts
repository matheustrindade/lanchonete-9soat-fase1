import { Product } from "@/domain/entity/Product";

export interface ProductRepository {
  update(product: Product): Promise<void>;
  create(product: Product): Promise<void>
  findById(id: string): Promise<Product | null>
}