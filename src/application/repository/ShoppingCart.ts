import { ShoppingCart } from "@/domain/entity/ShoppingCart";

export interface ShoppingCartRepository {
  delete(shoppingCart: ShoppingCart): Promise<void>;
  save(shoppingCart: ShoppingCart): Promise<void>;
  findByCustomerId(cpf: string): Promise<ShoppingCart | null>
}