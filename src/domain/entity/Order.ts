import { Id } from "@/domain/value-objects/Id";
import { PaymentTransaction } from ".";

interface OrderItem {
  productId: string;
  observation: string;
  quantity: number;
  price: number;
}

enum OrderStatus {
  PREPARING = "PREPARING",
  READY = "READY",
  FINISHED = "FINISHED",
}

export class Order {

  public static create(customerId: string, items: OrderItem[], totalPrice: number, payment: PaymentTransaction) {
    const id = Id.createString();
    const createdAt = new Date();
    return new Order(id, customerId, items, totalPrice, payment, OrderStatus.PREPARING, createdAt);
  }
  constructor(
    readonly id: string,
    readonly customerId: string,
    readonly items: OrderItem[],
    readonly totalPrice: number,
    readonly payment: PaymentTransaction,
    private status: OrderStatus,
    readonly createdAt: Date,
  ) {}
}
