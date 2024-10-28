import { Order } from "@/domain/entity/Order";

export interface OrderRepository {
  update(order: Order): Promise<void>;
  findById(id: string): Promise<Order | null>;
  create(order: Order): Promise<void>;
}
