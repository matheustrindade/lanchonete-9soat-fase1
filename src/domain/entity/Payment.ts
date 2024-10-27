export type PaymentStatus = "PENDING" | "CANCELLED" | "PAID";

export interface PaymentTransaction {
  id: string;
  internalId: string;
  qrCodeLink: string;
  qrCode: string;
  status: PaymentStatus;
}
