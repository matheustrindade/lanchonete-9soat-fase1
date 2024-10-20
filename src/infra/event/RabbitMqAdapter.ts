import { Event, EventPublisher } from "@/application/event/EventPublisher";
import { Connection } from "amqplib";

const exchange = "amq.direct"

export class RabbitMqAdapter implements EventPublisher {
  constructor(private connection: Connection) {}

  async publish(event: Event): Promise<void> {
		const channel = await this.connection.createChannel();
		channel.publish(exchange, event.name, Buffer.from(JSON.stringify(event)));
  }
}