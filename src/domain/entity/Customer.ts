import { Id } from "@/domain/value-objects/Id";

export class Customer {
    constructor(
        readonly id: string,
        readonly personalCode: string,
        readonly name: string,
        readonly email?: string
    ) {}

    static create(personalCode: string, name: string, email?: string) {
        const id = Id.createString();
        return new Customer(id, personalCode, name, email);
    } 

}