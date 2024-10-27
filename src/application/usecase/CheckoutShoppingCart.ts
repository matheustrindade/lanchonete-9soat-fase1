import { EmptyShoppingCartError } from "@/application/error";
import { EventPublisher, NewPreOrderCreatedEvent } from "@/application/event";
import { PaymentGateway } from "@/application/gateway";
import { PreOrderRepository, ShoppingCartRepository } from "@/application/repository";
import { Id } from "@/domain/value-objects/Id";

export class CheckoutShoppingCartUseCase {
  constructor(
    private readonly shoppingCartRepository: ShoppingCartRepository,
    private readonly paymentGateway: PaymentGateway,
    private readonly preOrderRepository: PreOrderRepository,
    private readonly eventPublisher: EventPublisher,
  ) {}

  public async execute(input: Input): Promise<Output> {
    const shoppingCart = await this.shoppingCartRepository.findByCustomerId(input.customerId);
    if (!shoppingCart) { throw EmptyShoppingCartError; }
    const payment = await this.paymentGateway.createPixPayment({
      id: Id.createString(),
      amount: shoppingCart.getTotalPrice(),
      customer: {
        name: "Guilherme Silveira", // TODO: Adicionar nome do usuario
        email: "4c283848-7505-49e6-9eb3-d285b8fd9a23@emailhook.site", // TODO: Adicionar email do usuario
      },
    });
    const preOrder = shoppingCart.checkout(payment);
    await this.preOrderRepository.create(preOrder);
    await this.eventPublisher.publish(NewPreOrderCreatedEvent(preOrder));
    return {
      preOrderId: preOrder.id,
      payment: {
        qrCode: preOrder.payment.qrCode,
        qrCodeLink: preOrder.payment.qrCodeLink,
      },
    };
  }
}

interface Input {
  customerId: string;
}

interface Output {
  preOrderId: string;
  payment: {
    qrCodeLink: string
    qrCode: string,
  };
}
