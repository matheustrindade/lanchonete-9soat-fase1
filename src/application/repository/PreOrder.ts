import { PreOrder } from "@/domain/entity/PreOrder";

export interface PreOrderRepository {
  delete(preOrder: PreOrder): Promise<void>;
  findByInternalId(internalId: string): Promise<PreOrder | null>;
  create(order: PreOrder): Promise<void>;
}
