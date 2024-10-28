import { Collection } from "mongodb";

export class OrderQuery {
  constructor(private readonly collection: Collection) {}

  async findById(id: string) {
    return this.collection
      .aggregate([
        {
          $match: { id }
        },
        {
          $unwind: "$items",
        },
        {
          $lookup: {
            from: "products",
            localField: "items.productId",
            foreignField: "id",
            as: "product",
          },
        },
        {
          $unwind: "$product",
        },
        {
          $project: {
            _id: 0,
            id: 1,
            customerId: 1,
            totalPrice: 1,
            createdAt: 1,
            status: 1,
            items: {
              productId: "$items.productId",
              productName: "$product.name",
              productPrice: "$items.price",
              productDescription: "$product.description",
              observation: "$items.observation",
              productCategory: "$product.category",
              quantity: "$items.quantity",
              totalPrice: "$totalPrice",
            },
          },
        },
        {
          $group: {
            _id: "$customerId",
            id: { $first: "$id" },
            customerId: { $first: "$customerId" },
            totalPrice: { $first: "$totalPrice" },
            status: { $first: "$status" },
            createdAt: { $first: "$createdAt" },
            items: { $push: "$items" },
          },
        },
        {
          $project: {
            _id: 0,
            id: 1,
            customerId: 1,
            totalPrice: 1,
            status: 1,
            createdAt: 1,
            items: 1,
          },
        },
      ])
      .toArray()
      .then((response) => (response[0]));
  }
}
