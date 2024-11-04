import { Collection } from "mongodb";

export class CustomerQuery {
    constructor(private readonly collection: Collection) {}

    async findByPersonalCode(personalCode: string) {
       return this.collection.find({ personalCode: { $eq: personalCode }}, { projection: { _id: 0 } }).toArray()
    }
}