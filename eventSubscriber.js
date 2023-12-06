// eventSubscriber.js
const amqp = require('amqplib');
const fs = require('fs');
const { url, exchange, queue, routingKey } = require('./config/rabbitmq');
const logger = require('./logger');

async function subscribeToEvents() {
  try {
    const connection = await amqp.connect(url);
    const channel = await connection.createChannel();

    await channel.assertExchange(exchange, 'direct', { durable: true });
    await channel.assertQueue(queue, { durable: true });
    await channel.bindQueue(queue, exchange, routingKey);

    await channel.consume(queue, (msg) => {
      const eventData = JSON.parse(msg.content.toString());
      console.log(`Received event: ${eventData.type}`, eventData.data);
      logEvent(eventData);

      // Log events to a file
      fs.appendFileSync('event.log', `${new Date().toISOString()} - ${eventData.type}: ${JSON.stringify(eventData.data)}\n`);

      channel.ack(msg);
    });

    console.log('Event subscriber is listening');
    logger.info('Event subscriber is listening');
  } catch (error) {
    console.error('Error subscribing to events:', error);
    logger.error('Error subscribing to events:', error);
    throw error;
  }
}

function logEvent(eventData) {
    const logMessage = `${new Date().toISOString()} - Received event '${eventData.type}' with data: ${JSON.stringify(eventData.data)}`;
    logger.info(logMessage);
    console.log(logMessage); 
  }

subscribeToEvents();

module.exports = { subscribeToEvents };