import { ShoppingCartRepository } from "@/application/repository/ShoppingCart";
import { ShoppingCart } from "@/domain/entity/ShoppingCart";
import { Collection } from "mongodb";

export class ShoppingCartMongoRepository implements ShoppingCartRepository {
  constructor(private readonly collection: Collection) {}

  async save(shoppingCart: ShoppingCart): Promise<void> {
    await this.collection.updateOne({ customerId: shoppingCart.customerId }, { $set: shoppingCart }, { upsert: true });
  }

  async findByCustomerId(customerId: string): Promise<ShoppingCart | null> {
    const shoppingCart = await this.collection.findOne<any>({ customerId });
    if (!shoppingCart) return null;
    return ShoppingCart.restore(shoppingCart.customerId, shoppingCart.totalPrice, shoppingCart.items);
  }

  async deleteByCustomerId(customerId: string): Promise<void> {
    await this.collection.deleteOne({ customerId })
  }
}
