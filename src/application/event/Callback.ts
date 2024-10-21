import { Event } from "./EventPublisher"

export const PAYMENT_CALLBACK_RECEIVED = "PAYMENT_CALLBACK_RECEIVED"

export function NewPaymentCallbackReceivedEvent(internalId: string): Event {
  return {
    internalId,
    name: PAYMENT_CALLBACK_RECEIVED,
  }
}