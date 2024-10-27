import { Collection } from "mongodb";

import { Product } from "@/domain/entity";
import { ProductRepository } from "@/application/repository";

export class ProductMongoRepository implements ProductRepository {
  constructor(private readonly collection: Collection) {}
  
  async listByCategory(category: string): Promise<Product[]> {
    const cursor = await this.collection.find({ category: { $eq: category }})
    const products = await cursor.toArray()
    return products.map((product: any) => {
      return Product.restore(
        product.id,
        product.name,
        product.description,
        product.price,
        product.category
      );
    })
  }

  async update(product: Product): Promise<void> {
    await this.collection.updateOne({ id: product.id }, { $set: product });
  }

  async findById(id: string): Promise<Product | null> {
    const product = await this.collection.findOne<any>({ id });
    if (!product) return null;
    return Product.restore(
      product.id,
      product.name,
      product.description,
      product.price,
      product.category
    );
  }

  async create(product: Product): Promise<void> {
    await this.collection.insertOne(product);
  }

  async delete(product: Product): Promise<void> {
    this.collection.deleteOne({ id: product.id })
  }
}
