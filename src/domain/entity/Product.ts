import { Id } from "@/domain/value-objects/Id";

export enum ProductCategory {
  BEBIDA = "Bebida",
  LANCHE = "Lanche",
  ACOMPANHAMENTO = "Acompanhamento",
  SOBREMESA = "Sobremesa",
}

export class Product {

  public static create(name: string, description: string, price: number, category: string): Product {
    const id = Id.createString();
    const productCategory = this.validateCategory(category);
    return new Product(id, name, description, price, productCategory);
  }

  public static restore(id: string, name: string, description: string, price: number, category: string): Product {
    const productCategory = this.validateCategory(category);
    return new Product(id, name, description, price, productCategory);
  }

  private static validateCategory(category: string): ProductCategory {
    switch (category) {
      case ProductCategory.BEBIDA: return ProductCategory.BEBIDA;
      case ProductCategory.ACOMPANHAMENTO: return ProductCategory.ACOMPANHAMENTO;
      case ProductCategory.LANCHE: return ProductCategory.LANCHE;
      case ProductCategory.SOBREMESA: return ProductCategory.SOBREMESA;
      default: throw new Error("Invalid category");
    }
  }
  constructor(
    readonly id: string,
    private name: string,
    private description: string,
    private price: number,
    private readonly category: ProductCategory,
  ) {}

  public update(name: string, description: string, price: number) {
    if (name) {
      this.name = name;
    }

    if (description) {
      this.description = description;
    }

    if (price) {
      this.price = price;
    }
  }

  public getName(): string {
    return this.name;
  }

  public getDescription(): string {
    return this.description;
  }

  public getPrice(): number {
    return this.price;
  }

  public getCategory(): string {
    return String(this.category);
  }
}
