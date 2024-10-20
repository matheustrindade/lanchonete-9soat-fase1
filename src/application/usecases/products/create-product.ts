import { inject } from "../../../infra/di/register";
import ProductRepository from "../../repository/product-repository";
import UseCase from "../usecase";

export default class CreateProduct implements UseCase{
    @inject('productRepository')
    repository?: ProductRepository

    async execute(input: Input): Promise<void> {
        const { description, price, category } = input;
        await this.repository?.create({
        description,
        price,
        category,
        });
    }
}

type Input = {
    description: string;
    price: number;
    category: string;
  };