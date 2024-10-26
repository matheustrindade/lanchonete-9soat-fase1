import { CustomerRepository } from "@/application/repository/Customer";
import { Customer } from "@/domain/entity/Customer";
import { Collection } from "mongodb";

export class CustomerMongoRepository implements CustomerRepository {
    constructor(private readonly collection: Collection) {}

    async create(customer: Customer): Promise<void> {
        await this.collection.insertOne(customer)
    }
}