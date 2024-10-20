import { MongoClient } from 'mongodb'
import amqp from "amqplib";

import { ExpressHttpServer } from '@/infra/http/HttpServer';
import { ProductController } from '@/infra/controller/Product';
import { RabbitMqAdapter } from '@/infra/event/RabbitMqAdapter';
import { ProductMongoRepository } from '@/infra/repository/ProductRepository';
import { ShoppingCartController } from '@/infra/controller/ShoppingCart';
import { ShoppingCartMongoRepository } from '@/infra/repository/ShoppingCartRepository';

async function start() {
  const [mongoClient, rabbitMqConnection] = await Promise.all([
    MongoClient.connect('mongodb://localhost:27017/lanchonete'),
    amqp.connect("amqp://localhost")
  ])
  const productCollection = mongoClient.db().collection('products')
  const shoppingCartCollection = mongoClient.db().collection('shopping_carts')

  const productRepository = new ProductMongoRepository(productCollection)
  const shoppingCartRepository = new ShoppingCartMongoRepository(shoppingCartCollection)
  const eventPublisher = new RabbitMqAdapter(rabbitMqConnection)
  
  const httpServer = new ExpressHttpServer()
  ProductController.registerRoutes(httpServer, productRepository, eventPublisher)
  ShoppingCartController.registerRoutes(httpServer, productRepository, shoppingCartRepository, eventPublisher)

  httpServer.get('/healthy', async () =>  ({ ok: true }))
  httpServer.listen(3000)
}

start()