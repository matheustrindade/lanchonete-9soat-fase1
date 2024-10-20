import HealthCheckController from "./infra/controller/healthcheck-controller";
import Registry from "./infra/di/register";
import ExpressAdapter from "./infra/http/express-adapter";

const httpServer = new ExpressAdapter();
Registry.getInstance().provide("httpServer", httpServer)
new HealthCheckController()
httpServer.listen(3000);