import { Event } from "./EventPublisher"
import { Order } from "@/domain/entity/Order"

export const ORDER_CREATED = "ORDER_CREATED"

export function NewOrderCreatedEvent(order: Order): Event {
  return {
    name: ORDER_CREATED,
    orderId: order.id,
    customerId: order.customerId
  }
}