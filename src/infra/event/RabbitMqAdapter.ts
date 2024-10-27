import { Event, EventPublisher } from "@/application/event/EventPublisher";
import { Connection } from "amqplib";
import { EventConsumer } from "./Consumer";

const exchange = "amq.direct";

export class RabbitMqAdapter implements EventPublisher, EventConsumer {
  constructor(private connection: Connection) {
    const queues = [
      {
        name: "CHECK_PAYMENT_STATUS",
        binding: { routingKey: "PAYMENT_CALLBACK_RECEIVED" },
      },
			{
        name: "DELETE_SHOPPING_CART",
        binding: { routingKey: "PRE_ORDER_CREATED" },
      },
    ];
    this.connection.createChannel().then(async (channel) => {
			await queues.map(async (queue) => {
				await channel.assertQueue(queue.name);
				return channel.bindQueue(queue.name, exchange, queue.binding.routingKey);
			})
      return channel.close();
    });
  }

  async consume(queue: string, callback: (event: Event) => Promise<void>): Promise<void> {
    const channel = await this.connection.createChannel();
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
