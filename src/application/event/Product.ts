import { Product } from "@/domain/entity/Product";
import { Event } from "./EventPublisher";

export const PRODUCT_CREATED = "PRODUCT_CREATED";
export const PRODUCT_UPDATED = "PRODUCT_UPDATED";
export const PRODUCT_DELETED = "PRODUCT_DELETED";

export function NewProductCreatedEvent(product: Product): Event {
  return {
    name: PRODUCT_CREATED,
    productId: product.id,
  };
}

export function NewProductUpdatedEvent(product: Product): Event {
  return {
    name: PRODUCT_UPDATED,
    productId: product.id,
  };
}

export function NewProductDeletedEvent(product: Product): Event {
  return {
    name: PRODUCT_DELETED,
    productId: product.id,
  };
}
