import { Id } from "@/domain/value-objects/Id";
import { PaymentTransaction } from ".";

interface PreOrderItem {
  productId: string;
  observation: string;
  quantity: number;
  price: number;
}

export class PreOrder {

  public static create(customerId: string, items: PreOrderItem[], totalPrice: number, payment: PaymentTransaction) {
    const id = Id.createString();
    const createdAt = new Date();
    return new PreOrder(id, customerId, payment.internalId, items, totalPrice, payment, createdAt);
  }

  public static restore(id: string, customerId: string, items: PreOrderItem[], totalPrice: number, payment: PaymentTransaction, createdAt: Date) {
    return new PreOrder(id, customerId, payment.internalId, items, totalPrice, payment, createdAt);
  }
  constructor(
    readonly id: string,
    readonly customerId: string,
    readonly internalId: string,
    readonly items: PreOrderItem[],
    readonly totalPrice: number,
    readonly payment: PaymentTransaction,
    readonly createdAt: Date,
  ) {}
}
