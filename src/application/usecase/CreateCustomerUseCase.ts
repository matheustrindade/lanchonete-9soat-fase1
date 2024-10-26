import { Customer } from "@/domain/entity/Customer";
import { EventPublisher } from "../event/EventPublisher";
import { CustomerRepository } from "../repository/Customer";
import { NewCustomerCreatedEvent } from "../event/Customer";

export class CreateCustomerUseCase {
    constructor(
        private customerRepository: CustomerRepository,
        private eventPublisher: EventPublisher
      ) {}

      async execute(input: CustomerInput): Promise<CustomerOutput> {
        const customer = Customer.create(input.name, input.personalCode, input.email)
        await this.customerRepository.create(customer)
        await this.eventPublisher.publish(NewCustomerCreatedEvent(customer))
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