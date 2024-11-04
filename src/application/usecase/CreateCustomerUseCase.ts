import { Customer } from "@/domain/entity/Customer";
import { CustomerRepository } from "../repository/Customer";

export class CreateCustomerUseCase {
    constructor(
        private customerRepository: CustomerRepository,
      ) {}

      async execute(input: CustomerInput): Promise<CustomerOutput> {
        const customer = Customer.create(input.personalCode, input.name, input.email)
        await this.customerRepository.create(customer)
        return {
            id: customer.id,
            name: customer.name,
            personalCode: customer.personalCode,
            email: customer.email
        }
    }
}

export interface CustomerInput {
    readonly name: string
    readonly personalCode: string
    readonly email?: string
}

export interface CustomerOutput {
    readonly id: string
    readonly name: string
    readonly personalCode: string
    readonly email?: string
}