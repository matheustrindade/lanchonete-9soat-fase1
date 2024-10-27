import { NewPaymentCallbackReceivedEvent } from "@/application/event/Callback";
import { EventPublisher } from "@/application/event/EventPublisher";
import HttpServer, { ResponseNoContent } from "@/infra/http/HttpServer";

export class CallbackController {
  static registerRoutes(
    httpServer: HttpServer,
    eventPublisher: EventPublisher
  ) {
    httpServer.post('/callback/mercado_pago/:id', async (request) => {
      if (request.body.action != "payment.updated") return ResponseNoContent()
      const internalId = request.params.id
      await eventPublisher.publish(NewPaymentCallbackReceivedEvent(internalId))
      return ResponseNoContent()
    })
  }
}