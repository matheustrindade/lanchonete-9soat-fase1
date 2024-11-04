import { OrderNotFoundError, ProductNotFoundError } from "@/application/error";

const NOT_FOUND = 404;
const INTERNAL_SERVER_ERROR = 500;

export function getStatusCodeFromError(error: Error): number {
  if (error instanceof ProductNotFoundError || error instanceof OrderNotFoundError) {
    return NOT_FOUND;
  }
  return INTERNAL_SERVER_ERROR;
}
