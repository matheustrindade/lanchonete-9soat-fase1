import { Event, EventPublisher } from "@/application/event/EventPublisher";
import { Connection } from "amqplib";
import { EventConsumer } from "./Consumer";

const exchange = "amq.direct"

export class RabbitMqAdapter implements EventPublisher, EventConsumer {
  constructor(private connection: Connection) {
		this.connection.createChannel().then(async (channel) => {
			await channel.assertQueue('CHECK_PAYMENT_STATUS')
			await channel.bindQueue('CHECK_PAYMENT_STATUS', 'amq.direct', 'PAYMENT_CALLBACK_RECEIVED')
			return channel.close()
		})
	}

  async consume(queue: string, callback: (event: Event) => Promise<void>): Promise<void> {
    const channel = await this.connection.createChannel()
		channel.consume(queue, async function (message: any) {
			const input = JSON.parse(message.content.toString());
			await callback(input);
			channel.ack(message);
		});
  }

  async publish(event: Event): Promise<void> {
		const channel = await this.connection.createChannel();
		channel.publish(exchange, event.name, Buffer.from(JSON.stringify(event)));
  }
}