import { Collection } from "mongodb";

export class ShoppingCartQuery {
  constructor(private readonly collection: Collection) {}

  async findByCustomerId(customerId: string) {
    return this.collection
      .aggregate([
        {
          $match: {
            customerId: customerId,
          },
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
            customerId: 1,
            totalPrice: 1,
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
            customerId: { $first: "$customerId" },
            totalPrice: { $first: "$totalPrice" },
            items: { $push: "$items" },
          },
        },
        {
          $project: {
            _id: 0,
            customerId: 1,
            totalPrice: 1,
            items: 1,
          },
        },
      ])
      .toArray()
      .then((response) => {
        if (response.length === 0) {
          return {
            customerId,
            items: [],
            totalPrice: 0.0,
          };
        }
        return response[0];
      });
  }
}
