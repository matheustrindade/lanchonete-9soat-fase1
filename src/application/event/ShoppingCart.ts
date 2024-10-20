import { Product } from "@/domain/entity/Product"
import { Event } from "./EventPublisher"
import { ShoppingCart } from "@/domain/entity/ShoppingCart"

export const PRODUCT_ADDED_TO_SHOPPING_CART = "PRODUCT_ADDED_TO_SHOPPING_CART"

export function NewProductAddedToShoppingCartEvent(product: Product, shoppingCart: ShoppingCart): Event {
  return {
    name: PRODUCT_ADDED_TO_SHOPPING_CART,
    productId: product.id,
    customerId: shoppingCart.customerId
  }
}