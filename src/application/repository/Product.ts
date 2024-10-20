import { Product } from "@/domain/entity/Product";

export interface ProductRepository {
  create(product: Product): Promise<void>
}