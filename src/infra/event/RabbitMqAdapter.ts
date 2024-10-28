import { Connection } from "amqplib";

import { Event, EventPublisher } from "@/application/event";
import { EventConsumer } from "./Consumer";

const exchange = "amq.direct";

export class RabbitMqAdapter implements EventPublisher, EventConsumer {
  constructor(private connection: Connection) {
    const queues = [
      {
        name: "CHECK_PAYMENT_STATUS",
        bindings: [{ routingKey: "PAYMENT_CALLBACK_RECEIVED" }],
      },
      {
        name: "DELETE_SHOPPING_CART",
        bindings: [{ routingKey: "PRE_ORDER_CREATED" }],
      },
      {
        name: "NOTIFY_CUSTOMER",
        bindings: [
          { routingKey: "ORDER_READY" },
          { routingKey: "ORDER_FINISHED" },
        ],
      },
    ];
    this.connection.createChannel().then(async (channel) => {
      await Promise.all(
        queues.map(async (queue) => {
          await channel.assertQueue(queue.name);
          return Promise.all(
            queue.bindings.map(binding => {
              return channel.bindQueue(
                queue.name,
                exchange,
                binding.routingKey
              );
            })
          )
        })
      );
      return channel.close();
    });
  }

  async consume(
    queue: string,
    callback: (event: Event) => Promise<void>
  ): Promise<void> {
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
