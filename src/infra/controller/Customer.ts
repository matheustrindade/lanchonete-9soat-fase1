import { CustomerRepository } from "@/application/repository/Customer";
import HttpServer, { ResponseCreated, ResponseOK } from "../http/HttpServer";
import { EventPublisher } from "@/application/event/EventPublisher";
import { CreateCustomerUseCase } from "@/application/usecase/CreateCustomerUseCase";
import { CustomerQuery } from "../projection/Customer";
import { CustomerNotFoundError } from "@/application/error/Customer";

export class CustomerController {
    static registerRoutes(
        httpServer: HttpServer,
        customerRepository: CustomerRepository,
        customerQuery: CustomerQuery
    ) {

        const createCustomerUseCase = new CreateCustomerUseCase(customerRepository)

        httpServer.post('/customers', (req) => {
            return createCustomerUseCase.execute({
                name: req.body.name,
                personalCode: req.body.personalCode,
                email: req.body.email
            }).then(ResponseCreated)
        })

        httpServer.get('/customers/:personalCode', req => {
            return customerQuery.findByPersonalCode(req.params.personalCode)
            .then(customer => {
              if (!customer?.length) throw CustomerNotFoundError
              return customer
            }).then(ResponseOK);
        })

    }

}