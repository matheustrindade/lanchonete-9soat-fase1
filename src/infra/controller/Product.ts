import { CreateProductUseCase } from "@/application/usecase/CreateProduct";
import HttpServer from "../http/HttpServer";

export class ProductController {

  static registerRoutes(httpServer: HttpServer, createProductUseCase: CreateProductUseCase) {
    httpServer.post("/products", request => {
      return createProductUseCase.execute({
        name: request.body.name,
        description: request.body.description,
        price: request.body.price,
        category: request.body.category
      })
    })
  }
}