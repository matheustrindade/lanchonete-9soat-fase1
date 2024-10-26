import { Customer } from "@/domain/entity/Customer"
import { Event } from "./EventPublisher"

export const CUSTOMER_CREATED = "CUSTOMER_CREATED"

export function NewCustomerCreatedEvent(customer: Customer): Event {
    return {
        name: CUSTOMER_CREATED,
        customerId: customer.id
    }
}