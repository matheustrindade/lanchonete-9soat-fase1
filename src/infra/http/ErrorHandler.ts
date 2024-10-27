import { ProductNotFoundError } from "@/application/error";

const NOT_FOUND = 404;
const INTERNAL_SERVER_ERROR = 404;

export function getStatusCodeFromError(error: Error): number {
  switch (error) {
    case ProductNotFoundError: return NOT_FOUND;
    default: return INTERNAL_SERVER_ERROR;
  }
}
