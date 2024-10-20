import { ProductRepository } from "@/application/repository/Product";
import { Product } from "@/domain/entity/Product";
import { Collection } from "mongodb";

export class ProductMongoRepository implements ProductRepository {
  constructor(private readonly collection: Collection) {}

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
}
