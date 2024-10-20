import ProductRepository, { CreateProductInput, DeleteProductInput, UpdateProductInput } from "../../application/repository/product-repository";
import DatabaseConnection from "../database/database-connection";
import { inject } from "../di/register";

export default class ProductRepositoryDatabase implements ProductRepository {
    @inject("database")
    database?: DatabaseConnection

    async create(input: CreateProductInput): Promise<void> {
        const { description, price, category } = input;
        let statement = `INSERT INTO products (description, price, category) VALUES (?, ?, ?);`;
        await this.database?.query(statement, [
          description,
          price,
          category,
        ]);
    }

    async update(input: UpdateProductInput): Promise<void> {
        var { params, values } = this.mapValues(input);
        let statement = `UPDATE products SET ${params} WHERE id=?;`;
        await this.database?.query(statement, [...values, input.id]);
    }

    async delete(input: DeleteProductInput): Promise<void> {
        const { id } = input;
        let statement = `DELETE FROM products WHERE id=?;`;
        await this.database?.query(statement, [id]);
    }

    private mapValues(input: any) {
        let arrayOfParams = [];
        let values = [];
        for (const param of Object.keys(input)) {
          if (input[param]) arrayOfParams.push(`${param} = ? `);
          values.push(input[param]);
        }
        const params = arrayOfParams.join(`,`);
        return { params, values };
    }
}