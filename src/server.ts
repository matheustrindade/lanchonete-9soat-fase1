import 'dotenv/config'

import { MongoClient } from "mongodb";
import amqp from "amqplib";
import MercadoPagoConfig, { Payment } from "mercadopago";

import { ExpressHttpServer } from "@/infra/http/HttpServer";
import { ProductController } from "@/infra/controller/Product";
import { RabbitMqAdapter } from "@/infra/event/RabbitMqAdapter";
import { ProductMongoRepository } from "@/infra/repository/ProductRepository";
import { ShoppingCartController } from "@/infra/controller/ShoppingCart";
import { ShoppingCartMongoRepository } from "@/infra/repository/ShoppingCartRepository";
import { PreOrderMongoRepository } from "@/infra/repository/PreOrderRepository";
import { MercadoPagoPaymentGateway } from "@/infra/gateway/MercadoPago";
import { ShoppingCartQuery } from "@/infra/projection/ShoppingCart";
import { CallbackController } from '@/infra/controller/Callback';
import { CallbackConsumer } from '@/infra/queue/Callback';
import { OrderMongoRepository } from '@/infra/repository/OrderRepository';

async function start() {
  const config = {
    mongoURL: String(process.env.MONGO_URL),
    rabbitMqURL: String(process.env.RABBITMQ_URL),
    mercadoPagoToken: String(process.env.MERCADO_PAGO_TOKEN),
    callbackUrl: String(process.env.CALLBACK_URL)
  }

  const [mongoClient, rabbitMqConnection] = await Promise.all([
    MongoClient.connect(config.mongoURL),
    amqp.connect(config.rabbitMqURL),
  ]);
  const productCollection = mongoClient.db().collection("products");
  const shoppingCartCollection = mongoClient.db().collection("shopping_carts");
  const preOrderCollection = mongoClient.db().collection("pre_orders");
  const orderCollection = mongoClient.db().collection("orders");

  const productRepository = new ProductMongoRepository(productCollection);
  const shoppingCartRepository = new ShoppingCartMongoRepository(shoppingCartCollection);
  const orderRepository = new OrderMongoRepository(orderCollection);
  const preOrderRepository = new PreOrderMongoRepository(preOrderCollection);
  const rabbitMqAdapter = new RabbitMqAdapter(rabbitMqConnection);

  const client = new MercadoPagoConfig({ accessToken: config.mercadoPagoToken });
  const payment = new Payment(client);
  const paymentGateway = new MercadoPagoPaymentGateway(payment, config.callbackUrl);

  const httpServer = new ExpressHttpServer();
  ProductController.registerRoutes(
    httpServer,
    productRepository,
    rabbitMqAdapter
  );

  const shoppingCartQuery = new ShoppingCartQuery(shoppingCartCollection)
  ShoppingCartController.registerRoutes(
    httpServer,
    productRepository,
    shoppingCartRepository,
    rabbitMqAdapter,
    paymentGateway,
    preOrderRepository,
    shoppingCartQuery
  );
  CallbackController.registerRoutes(httpServer, rabbitMqAdapter)
  await CallbackConsumer.registerConsumers(
    rabbitMqAdapter,
    preOrderRepository,
    paymentGateway,
    orderRepository,
    rabbitMqAdapter
  )

  httpServer.get("/healthy", async () => ({ ok: true }));
  httpServer.listen(3000);
}

start();