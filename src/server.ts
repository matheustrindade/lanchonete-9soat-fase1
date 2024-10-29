import 'dotenv/config'

import amqp from "amqplib";
import { MongoClient } from "mongodb";
import MercadoPagoConfig, { Payment } from "mercadopago";

import { ExpressHttpServer } from "@/infra/http/HttpServer";
import { RabbitMqAdapter } from "@/infra/event/RabbitMqAdapter";
import { MercadoPagoPaymentGateway } from "@/infra/gateway/MercadoPago";
import { ShoppingCartQuery } from "@/infra/projection/ShoppingCart";
import { CallbackConsumer } from '@/infra/queue/Callback';
import { ShoppingCartConsumer } from '@/infra/queue/ShoppingCart';
import { 
  ProductController, 
  CallbackController,
  ShoppingCartController,
} from "@/infra/controller";
import { 
  ProductMongoRepository,
  PreOrderMongoRepository,
  ShoppingCartMongoRepository,
  OrderMongoRepository,
} from '@/infra/repository';
import { OrderController } from './infra/controller/Order';
import { OrderQuery } from './infra/projection/Order';
import { CustomerController } from './infra/controller/Customer';
import { CustomerMongoRepository } from './infra/repository/CustomerRepository';
import { CustomerQuery } from './infra/projection/Customer';

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
  const mongoDatabase = mongoClient.db()
  const productCollection = mongoDatabase.collection("products");
  const shoppingCartCollection = mongoDatabase.collection("shopping_carts");
  const preOrderCollection = mongoDatabase.collection("pre_orders");
  const orderCollection = mongoDatabase.collection("orders");
  const customerCollection = mongoClient.db().collection("customers");

  const productRepository = new ProductMongoRepository(productCollection);
  const shoppingCartRepository = new ShoppingCartMongoRepository(shoppingCartCollection);
  const orderRepository = new OrderMongoRepository(orderCollection);
  const preOrderRepository = new PreOrderMongoRepository(preOrderCollection);
  const rabbitMqAdapter = new RabbitMqAdapter(rabbitMqConnection);
  const customerRepository = new CustomerMongoRepository(customerCollection)

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
  const orderQuery = new OrderQuery(orderCollection)
  OrderController.registerRoutes(httpServer, orderRepository, rabbitMqAdapter, orderQuery)
  await CallbackConsumer.registerConsumers(
    rabbitMqAdapter,
    preOrderRepository,
    paymentGateway,
    orderRepository,
    rabbitMqAdapter
  )
  await ShoppingCartConsumer.registerConsumers(rabbitMqAdapter, shoppingCartRepository)

  const customerQuery = new CustomerQuery(customerCollection)
  CustomerController.registerRoutes(httpServer, customerRepository, customerQuery);  

  httpServer.get("/healthy", async () => ({ status: 200, ok: true }));
  httpServer.listen(3000);
}

start();