// config/rabbitmq.js
require('dotenv').config();

module.exports = {
    url: process.env.RABBITMQ_URL, 
    exchange: 'user_events',
    queue: 'user_registration', 
    routingKey: 'user.registered',
  };
  