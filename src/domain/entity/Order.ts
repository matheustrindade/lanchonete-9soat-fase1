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

  constructor(
    readonly id: string,
    readonly customerId: string,
    readonly items: OrderItem[],
    readonly totalPrice: number,
    readonly payment: PaymentTransaction,
    private status: OrderStatus,
    readonly createdAt: Date,
    private completedAt?: Date,
    private finishedAt?: Date,
  ) {}

  public static create(customerId: string, items: OrderItem[], totalPrice: number, payment: PaymentTransaction) {
    const id = Id.createString();
    const createdAt = new Date();
    return new Order(id, customerId, items, totalPrice, payment, OrderStatus.PREPARING, createdAt);
  }

  public static restore(
    id: string, 
    customerId: string, 
    items: OrderItem[], 
    totalPrice: number, 
    status: OrderStatus, 
    payment: PaymentTransaction, 
    createdAt: Date,
    completedAt?: Date,
    finishedAt?: Date,
  ) {
    return new Order(id, customerId, items, totalPrice, payment, status, createdAt, completedAt, finishedAt);
  }

  completePreparation() {
    switch (this.status) {
      case OrderStatus.FINISHED:
        throw new Error("Order already finished");
      case OrderStatus.READY:
        throw new Error("Order already ready");
      case OrderStatus.PREPARING:
        this.status = OrderStatus.READY;
        this.completedAt = new Date()
        break
    }
  }

  finish() {
    switch (this.status) {
      case OrderStatus.FINISHED:
        throw new Error("Order already finished");
        case OrderStatus.PREPARING:
          throw new Error("Order preparing can not be finished");
      case OrderStatus.READY:
        this.status = OrderStatus.FINISHED
        this.finishedAt = new Date()
        break
    }
  }
}
