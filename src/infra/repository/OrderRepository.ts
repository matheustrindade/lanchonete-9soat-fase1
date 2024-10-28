import { Collection } from "mongodb";

import { Order } from "@/domain/entity";
import { OrderRepository } from "@/application/repository";

export class OrderMongoRepository implements OrderRepository {
  constructor(private readonly collection: Collection) {}

  async update(order: Order): Promise<void> {
    await this.collection.updateOne(
      { id: order.id }, 
      { $set: order }, 
    );
  }
  
  async findById(id: string): Promise<Order | null> {
    const order = await this.collection.findOne<any>({ id });
    if (!order) return null;
    return Order.restore(
      order.id,
      order.customerId,
      order.items,
      order.totalPrice,
      order.status,
      order.payment,
      order.createdAt,
      order.completedAt,
      order.finishedAt,
    );
  }

  async create(Order: Order): Promise<void> {
    await this.collection.insertOne(Order);
  }
}
