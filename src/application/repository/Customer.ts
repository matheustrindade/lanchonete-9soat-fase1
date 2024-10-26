import { Customer } from "@/domain/entity/Customer";

export interface CustomerRepository {
    create(customer: Customer) : Promise<void>
}