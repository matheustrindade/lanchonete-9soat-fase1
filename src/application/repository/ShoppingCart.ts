import { ShoppingCart } from "@/domain/entity/ShoppingCart";

export interface ShoppingCartRepository {
  save(shoppingCart: ShoppingCart): Promise<void>;
  findByCustomerId(cpf: string): Promise<ShoppingCart | null>
}