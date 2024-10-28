import { OrderNotFoundError, ProductNotFoundError } from "@/application/error";

const NOT_FOUND = 404;
const INTERNAL_SERVER_ERROR = 500;

export function getStatusCodeFromError(error: Error): number {
  switch (error) {
    case ProductNotFoundError:
    case OrderNotFoundError: return NOT_FOUND;
    default: return INTERNAL_SERVER_ERROR;
  }
}
