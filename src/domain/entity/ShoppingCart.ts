import { PaymentTransaction, PreOrder, Product } from ".";

interface ShoppingCartItem {
  productId: string;
  observation: string;
  quantity: number;
  price: number;
}

export class ShoppingCart {

  public static create(customerId: string): ShoppingCart {
    return new ShoppingCart(customerId);
  }

  public static restore(customerId: string, totalPrice: number, items: ShoppingCartItem[]): ShoppingCart {
    const shoppingCart = new ShoppingCart(customerId);
    shoppingCart.totalPrice = totalPrice;
    shoppingCart.items = items;
    return shoppingCart;
  }
  private items: ShoppingCartItem[];
  private totalPrice: number;

  constructor(readonly customerId: string) {
    this.items = [];
    this.totalPrice = 0.0;
  }

  public addProduct(product: Product, quantity: number, observation: string) {
    if (!quantity || quantity <= 0) { throw new Error("The quantity should be greather than zero"); }
    this.items.push({
      productId: product.id,
      price: product.getPrice(),
      quantity,
      observation,
    });
    this.totalPrice += product.getPrice() * quantity;
  }

  public checkout(payment: PaymentTransaction): PreOrder {
    return PreOrder.create(this.customerId, this.items, this.totalPrice, payment);
  }

  public getTotalPrice(): number {
    return this.totalPrice;
  }
}
