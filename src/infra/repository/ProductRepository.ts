import { ProductRepository } from "@/application/repository/Product";
import { Product } from "@/domain/entity/Product";
import { Collection } from 'mongodb'

export class ProductMongoRepository implements ProductRepository {
  constructor(private readonly collection: Collection) {}

  async create(product: Product): Promise<void> {
    await this.collection.insertOne(product)
  }
}