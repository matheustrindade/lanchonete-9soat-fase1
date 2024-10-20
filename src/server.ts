import { MongoClient } from 'mongodb'
import amqp from "amqplib";

import { ExpressHttpServer } from '@/infra/http/HttpServer';
import { ProductController } from '@/infra/controller/Product';
import { RabbitMqAdapter } from '@/infra/event/RabbitMqAdapter';
import { ProductMongoRepository } from '@/infra/repository/ProductRepository';

async function start() {
  const [mongoClient, rabbitMqConnection] = await Promise.all([
    MongoClient.connect('mongodb://localhost:27017/lanchonete'),
    amqp.connect("amqp://localhost")
  ])
  const productCollection = mongoClient.db().collection('products')

  const productRepository = new ProductMongoRepository(productCollection)
  const eventPublisher = new RabbitMqAdapter(rabbitMqConnection)
  
  const httpServer = new ExpressHttpServer()
  ProductController.registerRoutes(httpServer, productRepository, eventPublisher)

  httpServer.get('/healthy', async () =>  ({ ok: true }))
  httpServer.listen(3000)
}

start()