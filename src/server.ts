import { MongoClient } from 'mongodb'
import amqp from "amqplib";
import { ProductController } from './infra/controller/Product';
import { ExpressHttpServer } from './infra/http/HttpServer';
import { CreateProductUseCase } from './application/usecase/CreateProduct';
import { ProductMongoRepository } from './infra/repository/ProductRepository';
import { RabbitMqAdapter } from './infra/event/RabbitMqAdapter';
import { UpdateProductUseCase } from './application/usecase/UpdateProduct';

async function start() {
  const [mongoClient, rabbitMqConnection] = await Promise.all([
    MongoClient.connect('mongodb://localhost:27017/lanchonete'),
    amqp.connect("amqp://localhost")
  ])
  const productCollection = mongoClient.db().collection('products')

  const productRepository = new ProductMongoRepository(productCollection)
  const eventPublisher = new RabbitMqAdapter(rabbitMqConnection)

  const createProductUseCase = new CreateProductUseCase(productRepository, eventPublisher)
  const updateProductUseCase = new UpdateProductUseCase(productRepository, eventPublisher)
  
  const httpServer = new ExpressHttpServer()
  ProductController.registerRoutes(httpServer, createProductUseCase, updateProductUseCase)

  httpServer.get('/healthy', async () =>  ({ ok: true }))
  httpServer.listen(3000)
}

start()