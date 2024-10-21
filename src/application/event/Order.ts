import { Order } from "@/domain/entity/Order"
import { Event } from "./EventPublisher"

export const ORDER_CREATED = "ORDER_CREATED"

export function NewOrderCreatedEvent(order: Order): Event {
  return {
    name: ORDER_CREATED,
    orderId: order.id,
    customerId: order.customerId
  }
}