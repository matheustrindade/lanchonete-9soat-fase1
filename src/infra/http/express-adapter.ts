import HttpServer from "./http-server";
import express from 'express';
import swaggerUi from "swagger-ui-express";
import * as fs from 'fs';
import * as path from 'path';

export default class ExpressAdapter implements HttpServer {
    app: any;

    constructor() {
        this.app = express();
        this.app.use(express.json());
        const filePath = path.join(__dirname, '..', 'swagger.json');
        if (fs.existsSync(filePath)) {
            const data = fs.readFileSync(filePath, 'utf8');
            this.app.use("/docs", swaggerUi.serve, swaggerUi.setup(JSON.parse(data)));
        }
    }
    register(method: string, url: string, callback: Function): void {
        this.app[method](url, async(req: any, res: any)=>{
            try {
                const output = await callback(req.params, req.body)
                res.json(output)
            } catch (error: any) {
                res.status(422).json({
                    message: error.message
                })
            }
        })
    }
    listen(port: number): void {
        this.app.listen(port);
    }
}