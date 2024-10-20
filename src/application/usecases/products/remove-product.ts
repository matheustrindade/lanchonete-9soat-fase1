import { inject } from "../../../infra/di/registry";
import ProductRepository from "../../repository/product-repository";
import UseCase from "../usecase";

export default class DeleteProduct implements UseCase {
    @inject('productRepository')
    repository?: ProductRepository

    async execute(input: Input) {
      await this.repository?.delete({ id: input.id });
    }
}

type Input = {
    id: number;
};