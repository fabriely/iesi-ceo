import 'dotenv/config';
import './env';
import app from './app';
import '@database';
import { connectRabbitMQ, consumeMessages } from './rabbit';

async function startServer() {
  await connectRabbitMQ();
  
  app.listen(process.env.SERVER_PORT || 3001, () => {
    console.log(`🚀 Server ready at http://localhost:${process.env.SERVER_PORT || 3001}`);
  });
}

startServer();
