import { Product } from "@/domain/entity/Product"
import { Event } from "./EventPublisher"

export const PRODUCT_CREATED = "PRODUCT_CREATED"

export function NewProductCreatedEvent(product: Product): Event {
  return {
    name: PRODUCT_CREATED,
    productId: product.id
  }
}