import { OrderRepository } from "@/application/repository/Order";
import { Order } from "@/domain/entity/Order";
import { Collection } from "mongodb";

export class OrderMongoRepository implements OrderRepository {
  constructor(private readonly collection: Collection) {}

  async create(order: Order): Promise<void> {
    await this.collection.insertOne(order);
  }
}
