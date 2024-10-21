import { Order } from "@/domain/entity/Order";

export interface OrderRepository {
  findByOrder(id: string): Promise<Order | null>;
  create(order: Order): Promise<void>
}