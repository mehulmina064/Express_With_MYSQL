// eventPublisher.js
const amqp = require('amqplib');
const { url, exchange, routingKey } = require('./config/rabbitmq');
const logger = require('./logger');

async function publishEvent(eventType, eventData) {
  try {
    const connection = await amqp.connect(url);
    const channel = await connection.createChannel();

    await channel.assertExchange(exchange, 'direct', { durable: true });
    await channel.publish(exchange, routingKey, Buffer.from(JSON.stringify({ type: eventType, data: eventData })));

    console.log(`Event published: ${eventType}`);
    logger.info(`Event published: ${eventType}`);

    await channel.close();
    await connection.close();
  } catch (error) {
    console.error('Error publishing event:', error);
    logger.error('Error publishing event:', error);
    throw error;
  }
}

module.exports = { publishEvent };
