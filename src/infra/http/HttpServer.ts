import express from "express";
import cors from "cors";

type PostCallback = (request: { body: any }) => Promise<unknown>
type GetCallback = (request: { params: any }) => Promise<unknown>

export default interface HttpServer {
	get(url: string, callback: GetCallback): void;
	post(url: string, callback: PostCallback): void;
	listen (port: number): void;
}

export class ExpressHttpServer implements HttpServer {
	private app: express.Express;

	constructor () {
		this.app = express();
		this.app.use(express.json());
		this.app.use(cors());
	}
	get(url: string, callback: GetCallback): void {
		this.app.get(url, async function (req: any, res: any) {
			try {
				const output = await callback({ params: req.params });
				res.json(output);
			} catch (e: any) {
				res.status(422).json({ message: e.message });
			}
		});
	}

	post(url: string, callback: PostCallback): void {
		this.app.post(url, async function (req: any, res: any) {
			try {
				const output = await callback({ body: req.body });
				res.json(output);
			} catch (e: any) {
				res.status(422).json({ message: e.message });
			}
		});
	}

	listen(port: number): void {
		this.app.listen(port, () => console.log('Application running on port:', port));
	}
}