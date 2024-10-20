import { Order } from "@/domain/entity/Order";

export interface OrderRepository {
  create(order: Order): Promise<void>
}