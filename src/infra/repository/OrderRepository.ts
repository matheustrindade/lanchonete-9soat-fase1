import { OrderRepository } from "@/application/repository/Order";
import { Order } from "@/domain/entity/Order";
import { Collection } from "mongodb";

export class OrderMongoRepository implements OrderRepository {
  constructor(private readonly collection: Collection) {}
  
  async findByOrder(orderId: string): Promise<Order | null> {
    const order = await this.collection.findOne<any>({ id: orderId });
    if (!order) return null;
    return order.restore(
      order.id,
      order.customerId,
      order.items,
      order.totalPrice,
      order.payment,
      order.createdAt,
    );
  }

  async create(order: Order): Promise<void> {
    await this.collection.insertOne(order);
  }
}
