import { Id } from "@/domain/value-objects/Id"

export enum ProductCategory {
  BEBIDA,
  LANCHE,
  ACOMPANHAMENTO,
  SOBREMESA
}

export class Product {
  constructor(
    readonly id: string, 
    readonly name: string, 
    readonly description: string, 
    readonly price: number,
    readonly category: ProductCategory
  ) {}

  static create(name: string, description: string, price: number, category: ProductCategory): Product {
    const id = Id.createString()
    return new Product(id, name, description, price, category)
  }
}