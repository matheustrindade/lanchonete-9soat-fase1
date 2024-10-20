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
import { OrderMongoRepository } from "@/infra/repository/OrderRepository";
import { MercadoPagoPaymentGateway } from "@/infra/gateway/MercadoPago";
import { ShoppingCartQuery } from "@/infra/projection/ShoppingCart";

async function start() {
  const config = {
    mongoURL: String(process.env.MONGO_URL),
    rabbitMqURL: String(process.env.RABBITMQ_URL),
    mercadoPagoToken: String(process.env.MERCADO_PAGO_TOKEN)
  }

  const [mongoClient, rabbitMqConnection] = await Promise.all([
    MongoClient.connect(config.mongoURL),
    amqp.connect(config.rabbitMqURL),
  ]);
  const productCollection = mongoClient.db().collection("products");
  const shoppingCartCollection = mongoClient.db().collection("shopping_carts");
  const orderCollection = mongoClient.db().collection("orders");

  const productRepository = new ProductMongoRepository(productCollection);
  const shoppingCartRepository = new ShoppingCartMongoRepository(shoppingCartCollection);
  const orderRepository = new OrderMongoRepository(orderCollection);
  const eventPublisher = new RabbitMqAdapter(rabbitMqConnection);

  const client = new MercadoPagoConfig({ accessToken: config.mercadoPagoToken });
  const payment = new Payment(client);
  const paymentGateway = new MercadoPagoPaymentGateway(payment);

  const httpServer = new ExpressHttpServer();
  ProductController.registerRoutes(
    httpServer,
    productRepository,
    eventPublisher
  );

  const shoppingCartQuery = new ShoppingCartQuery(shoppingCartCollection)
  ShoppingCartController.registerRoutes(
    httpServer,
    productRepository,
    shoppingCartRepository,
    eventPublisher,
    paymentGateway,
    orderRepository,
    shoppingCartQuery
  );

  httpServer.get("/healthy", async () => ({ ok: true }));
  httpServer.listen(3000);
}

start();
