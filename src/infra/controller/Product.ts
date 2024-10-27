import HttpServer, { ResponseCreated, ResponseNoContent, ResponseOK } from "../http/HttpServer";
import { CreateProductUseCase } from "@/application/usecase/CreateProduct";
import { UpdateProductUseCase } from "@/application/usecase/UpdateProduct";
import { DeleteProductUseCase } from "@/application/usecase/DeleteProduct";
import { ProductRepository } from "@/application/repository/Product";
import { EventPublisher } from "@/application/event/EventPublisher";
import { ListProductsUseCase } from "@/application/usecase/ListProducts";

export class ProductController {
  static registerRoutes(
    httpServer: HttpServer,
    productRepository: ProductRepository,
    eventPublisher: EventPublisher
  ) {
    const listProductsUseCase = new ListProductsUseCase(productRepository,);
    const createProductUseCase = new CreateProductUseCase(productRepository, eventPublisher);
    const updateProductUseCase = new UpdateProductUseCase(productRepository, eventPublisher);
    const deleteProductUseCase = new DeleteProductUseCase(productRepository, eventPublisher);

    httpServer.get("/products", (request) => {
      return listProductsUseCase.execute({ 
        category: request.params.category
      }).then(ResponseOK);
    });

    httpServer.post("/products", (request) => {
      return createProductUseCase.execute({
        name: request.body.name,
        description: request.body.description,
        price: request.body.price,
        category: request.body.category,
      }).then(ResponseCreated);
    });

    httpServer.patch("/products/:id", (request) => {
      return updateProductUseCase.execute({
        productId: request.params.id,
        name: request.body.name,
        description: request.body.description,
        price: request.body.price,
      }).then(ResponseOK);
    });

    httpServer.delete("/products/:id", (request) => {
      return deleteProductUseCase.execute({ 
        productId: request.params.id
      }).then(ResponseNoContent);
    });
  }
}
