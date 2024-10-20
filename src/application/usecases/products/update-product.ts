import { inject } from "../../../infra/di/register";
import ProductRepository from "../../repository/product-repository";

export default class UpdateProduct {
    @inject('productRepository')
    repository?: ProductRepository

    async execute(input: Input) {
      const { id, description, price, category } = input;
      await this.repository?.update({
        id,
        description,
        price,
        category,
      });
    }
  }
  
  type Input = {
    id: number;
    description: string;
    price: number;
    category: string;
  };