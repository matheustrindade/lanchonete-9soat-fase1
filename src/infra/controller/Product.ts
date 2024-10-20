import HttpServer from "../http/HttpServer";
import { CreateProductUseCase } from "@/application/usecase/CreateProduct";
import { UpdateProductUseCase } from "@/application/usecase/UpdateProduct";
import { DeleteProductUseCase } from "@/application/usecase/DeleteProduct";
import { ProductRepository } from "@/application/repository/Product";
import { EventPublisher } from "@/application/event/EventPublisher";

export class ProductController {

  static registerRoutes(
    httpServer: HttpServer, 
    productRepository: ProductRepository,
    eventPublisher: EventPublisher,
  ) {
  const createProductUseCase = new CreateProductUseCase(productRepository, eventPublisher)
  const updateProductUseCase = new UpdateProductUseCase(productRepository, eventPublisher)
  const deleteProductUseCase = new DeleteProductUseCase(productRepository, eventPublisher)

    httpServer.post("/products", request => {
      return createProductUseCase.execute({
        name: request.body.name,
        description: request.body.description,
        price: request.body.price,
        category: request.body.category
      })
    })
    httpServer.patch("/products/:id", request => {
      return updateProductUseCase.execute({
        productId: request.params.id,
        name: request.body.name,
        description: request.body.description,
        price: request.body.price,
      })
    })
    httpServer.delete("/products/:id", request => {
      return deleteProductUseCase.execute({ productId: request.params.id })
    })
  }
}