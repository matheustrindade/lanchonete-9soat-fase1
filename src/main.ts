import { CreateProduct, DeleteProduct, UpdateProduct } from "./application/usecases/products";
import HealthCheckController from "./infra/controller/healthcheck-controller";
import ProductsController from "./infra/controller/products-controller";
import MysqlAdapter from "./infra/database/mysql-adapter";
import Registry from "./infra/di/register";
import ExpressAdapter from "./infra/http/express-adapter";
import ProductRepositoryDatabase from "./infra/repository/product-repository-database";

const httpServer = new ExpressAdapter();
const database = new MysqlAdapter();
const productRepository = new ProductRepositoryDatabase()
const createProduct = new CreateProduct();
const updateProduct = new UpdateProduct();
const deleteProduct = new DeleteProduct();

Registry.getInstance().provide("httpServer", httpServer);
Registry.getInstance().provide("database", database);
Registry.getInstance().provide("productRepository", productRepository);
Registry.getInstance().provide("createProduct", createProduct);
Registry.getInstance().provide("updateProduct", updateProduct);
Registry.getInstance().provide("deleteProduct", deleteProduct);

new HealthCheckController();
new ProductsController();
httpServer.listen(3000);