import { Product } from "@/domain/entity/Product";

export interface ProductRepository {
  listByCategory(category: string): Promise<Product[]>;
  update(product: Product): Promise<void>;
  delete(product: Product): Promise<void>;
  create(product: Product): Promise<void>;
  findById(id: string): Promise<Product | null>;
}
