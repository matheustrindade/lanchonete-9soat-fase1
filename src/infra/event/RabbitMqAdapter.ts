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

    // Canal de inicialização das filas
    this.initializeQueues(queues);
  }

  private async initializeQueues(queues: Array<{ name: string; bindings: { routingKey: string }[] }>) {
    const channel = await this.connection.createChannel();
    await channel.assertExchange(exchange, "direct", { durable: true });
    await Promise.all(
      queues.map(async (queue) => {
        await channel.assertQueue(queue.name, { durable: true });
        return Promise.all(
          queue.bindings.map(binding => {
            return channel.bindQueue(
              queue.name,
              exchange,
              binding.routingKey
            );
          })
        );
      })
    );
    // Não fechamos o canal após configuração das filas
  }

  async consume(
    queue: string,
    callback: (event: Event) => Promise<void>
  ): Promise<void> {
    const channel = await this.connection.createChannel();
    await channel.assertQueue(queue, { durable: true }); // Confirma a existência da fila
    channel.consume(queue, async (message: any) => {
      if (message !== null) {
        const input = JSON.parse(message.content.toString());
        await callback(input);
        channel.ack(message);
      }
    });
  }

  async publish(event: Event): Promise<void> {
    const channel = await this.connection.createChannel();
    await channel.assertExchange(exchange, "direct", { durable: true });
    channel.publish(exchange, event.name, Buffer.from(JSON.stringify(event)));
    channel.close(); // Fechar após publicar o evento
  }
}
