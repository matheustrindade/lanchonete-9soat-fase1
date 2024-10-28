import { Order } from "@/domain/entity/Order";
import { Event } from "./EventPublisher";

export const ORDER_CREATED = "ORDER_CREATED";
export const ORDER_READY = "ORDER_READY";

export function NewOrderCreatedEvent(order: Order): Event {
  return {
    name: ORDER_CREATED,
    orderId: order.id,
    customerId: order.customerId,
  };
}

export function NewOrderReadyEvent(order: Order): Event {
  return {
    name: ORDER_READY,
    orderId: order.id,
    customerId: order.customerId,
  };
}

