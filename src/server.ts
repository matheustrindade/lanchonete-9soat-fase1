import express from 'express'
import { Router, Request, Response, NextFunction } from 'express';

const app = express();
const route = Router()

app.use((_: Request, res: Response, next: NextFunction) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

app.use(express.json())

route.get('/healthy', (_: Request, res: Response) => {
  res.status(200).json({message: "App is up and running!"})
})

app.use(route)


app.listen(80, () => 'server running on port 80')
