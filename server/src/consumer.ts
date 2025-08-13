import { connectRabbitMQ, consumeMessages } from './rabbit';

(async () => {
  await connectRabbitMQ();
  await consumeMessages('patient_stats', (msg) => {
    console.log('📩 Mensagem recebida:', msg);
  });
})();
