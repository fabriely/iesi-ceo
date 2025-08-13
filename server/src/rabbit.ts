import * as amqp from 'amqplib';

let channel: amqp.Channel;

export async function connectRabbitMQ() {
  try {
    const connection = await amqp.connect(process.env.RABBITMQ_URL || 'amqp://localhost:5672');
    channel = await connection.createChannel();

    console.log('✅ Conectado ao RabbitMQ');
  } catch (err) {
    console.error('❌ Erro ao conectar no RabbitMQ:', err);
    process.exit(1);
  }
}

export async function sendMessage(queue: string, message: string) {
  if (!channel) throw new Error('RabbitMQ não conectado');
  await channel.assertQueue(queue, { durable: true });
  channel.sendToQueue(queue, Buffer.from(message), { persistent: true });
}

export async function consumeMessages(queue: string, callback: (msg: string) => void) {
  if (!channel) throw new Error('RabbitMQ não conectado');
  await channel.assertQueue(queue, { durable: true });
  channel.consume(
    queue,
    (msg) => {
      if (msg) {
        callback(msg.content.toString());
        channel.ack(msg);
      }
    },
    { noAck: false }
  );
}
