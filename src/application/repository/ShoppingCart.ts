import { ShoppingCart } from "@/domain/entity/ShoppingCart";

export interface ShoppingCartRepository {
  deleteByCustomerId(customerId: string): Promise<void>;
  save(shoppingCart: ShoppingCart): Promise<void>;
  findByCustomerId(cpf: string): Promise<ShoppingCart | null>;
}
