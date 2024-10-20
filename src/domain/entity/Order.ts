import { Id } from "../value-objects/Id";
import { PaymentTransaction } from "./Payment";

type OrderItem = {
  productId: string;
  observation: string;
  quantity: number;
  price: number;
};

enum OrderStatus {
  AWAITING_PAYMENT,
  PREPARING,
  READY,
  FINISHED
}

export class Order {
  constructor(
    readonly id: string, 
    readonly customerId: string, 
    readonly items: OrderItem[], 
    readonly totalPrice: number, 
    readonly payment: PaymentTransaction,
    private status: OrderStatus,
    readonly createdAt: Date
  ) {}

  static create(customerId: string, items: OrderItem[], totalPrice: number, payment: PaymentTransaction) {
    const id = Id.createString()
    const createdAt = new Date()
    return new Order(id, customerId, items, totalPrice, payment, OrderStatus.AWAITING_PAYMENT, createdAt)
  }
}