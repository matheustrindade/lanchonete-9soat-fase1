import { CreateProductUseCase } from "@/application/usecase/CreateProduct";
import HttpServer from "../http/HttpServer";
import { UpdateProductUseCase } from "@/application/usecase/UpdateProduct";

export class ProductController {

  static registerRoutes(
    httpServer: HttpServer, 
    createProductUseCase: CreateProductUseCase,
    updateProductUseCase: UpdateProductUseCase
  ) {
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
  }
}