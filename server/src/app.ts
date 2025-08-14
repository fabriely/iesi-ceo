import express, { Express } from 'express';
import http from 'http';
import { initSocket } from './io';
import cors from 'cors';
import helmet from 'helmet';
import routes from './routes';


const app: Express = express();
const server = http.createServer(app);

initSocket(server);

app.use(helmet());

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

app.use(routes);

export { app, server };