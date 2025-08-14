import 'dotenv/config';
import './env';
import { server } from './app'; 
import '@database';
import { connectRabbitMQ } from './rabbit';
import { startConsumer } from './consumer'; 

async function startServer() {
  await connectRabbitMQ();
  
  server.listen(process.env.SERVER_PORT || 3001, () => {
    console.log(`🚀 Server ready at http://localhost:${process.env.SERVER_PORT || 3001}`);
    startConsumer();
  });
}

startServer();
