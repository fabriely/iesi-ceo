import { connectRabbitMQ, consumeMessages } from './rabbit';
import { getIO } from './io';

export async function startConsumer() {
  await connectRabbitMQ();
  await consumeMessages('patient_stats', (msg) => {
    console.log('📩 Mensagem recebida da fila:', msg);
    try {
      // Emite um evento para todos os clientes conectados
      getIO().emit('notification', {
        title: 'Notificação de TI',
        message: `Filtro de pesquisa foi utilizado.`,
        data: msg,
      });
      console.log('📡 Notificação enviada para os clientes via WebSocket.');
    } catch (error) {
      console.error('Falha ao emitir evento via socket:', error);
    }
  });
  console.log('👂 Consumidor RabbitMQ iniciado e ouvindo a fila.');
}