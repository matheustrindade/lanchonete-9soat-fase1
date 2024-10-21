import { PreOrder } from "@/domain/entity/PreOrder"
import { Event } from "./EventPublisher"

export const PRE_ORDER_CREATED = "PRE_ORDER_CREATED"

export function NewPreOrderCreatedEvent(order: PreOrder): Event {
  return {
    name: PRE_ORDER_CREATED,
    orderId: order.id,
    customerId: order.customerId,
    internalId: order.payment.internalId
  }
}