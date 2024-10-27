import { Collection } from "mongodb";

import { PreOrder } from "@/domain/entity";
import { PreOrderRepository } from "@/application/repository";

export class PreOrderMongoRepository implements PreOrderRepository {
  constructor(private readonly collection: Collection) {}
  
  async delete(preOrder: PreOrder): Promise<void> {
    await this.collection.deleteOne({ id: preOrder.id })
  }
  
  async findByInternalId(internalId: string): Promise<PreOrder | null> {
    const preOrder = await this.collection.findOne<any>({ internalId });
    if (!preOrder) return null;
    return PreOrder.restore(
      preOrder.id,
      preOrder.customerId,
      preOrder.items,
      preOrder.totalPrice,
      preOrder.payment,
      preOrder.createdAt,
    );
  }

  async create(preOrder: PreOrder): Promise<void> {
    await this.collection.insertOne(preOrder);
  }
}
