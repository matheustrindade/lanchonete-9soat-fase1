import { CreateProduct, DeleteProduct, UpdateProduct } from "../../application/usecases/products";
import { inject } from "../di/register";
import HttpServer from "../http/http-server";

export default class ProductsController {
    @inject("httpServer")
    httpServer?: HttpServer
    @inject("createProduct")
    createProduct?: CreateProduct
    @inject("updateProduct")
    updateProduct?: UpdateProduct
    @inject("deleteProduct")
    deleteProduct?: DeleteProduct

    constructor() {
        this.httpServer?.register("post","/product", async (params: any, body: any) => {
            const { description, price, category } = body;
            await this.createProduct?.execute({ description, price, category })
            return { message: "Produto adicionado com sucesso" };
        });
        this.httpServer?.register("patch","/product", async (params: any, body: any) => {
            const { id } = params;
            const { description, price, category } = body;
            await this.updateProduct?.execute({ id, description, price, category })
            return { message: "Produto alterado com sucesso" };
        });
        this.httpServer?.register("delete","/product", async (params: any, body: any) => {
            const { id } = params;
            await this.deleteProduct?.execute({ id })
            return { message: "Produto removido com sucesso" };
        });
    }
}