import { CustomerRepository } from "@/application/repository/Customer";
import HttpServer from "../http/HttpServer";
import { EventPublisher } from "@/application/event/EventPublisher";
import { CreateCustomerUseCase } from "@/application/usecase/CreateCustomerUseCase";

export class CustomerController {
    static registerRoutes(
        httpServer: HttpServer,
        customerRepository: CustomerRepository,
        eventPublisher: EventPublisher
    ) {

        const createCustomerUseCase = new CreateCustomerUseCase(customerRepository, eventPublisher)

        httpServer.post('/customers', req => {
            return createCustomerUseCase.execute({
                name: req.body.name,
                personalCode: req.body.personalCode,
                email: req.body.email
            })
        })

        httpServer.get('/customers/:postalCode', req => {
            return Promise.resolve(void 0)
        })

    }

}