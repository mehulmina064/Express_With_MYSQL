// app.js
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUI = require('swagger-ui-express');
const mongoose = require('mongoose');
const amqp = require('amqplib');
const authRoutes = require('./routes/authRoutes');
const gameRoutes = require('./routes/gameRoutes');
const errorMiddleware = require('./middleware/errorMiddleware');
const validationMiddleware = require('./middleware/validationMiddleware');
const authMiddleware = require('./middleware/authMiddleware');

const app = express();

app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_DB_URI)
    .then(() => {
      console.log('Connected to MongoDB (Database 1)');
    })
    .catch((error) => {
      console.error('MongoDB connection error:', error);
    });

// RabbitMQ setup
const { url, exchange, queue, routingKey } = require('./config/rabbitmq');
let channel;
(async () => {
    try {
      const connection = await amqp.connect(url);
      const channel = await connection.createChannel();
  
      await channel.assertExchange(exchange, 'direct', { durable: true });
      await channel.assertQueue(queue, { durable: true });
      await channel.bindQueue(queue, exchange, routingKey);
  
      console.log('Connected to RabbitMQ');
    } catch (error) {
      console.error('Error in RabbitMQ setup:', error);
    }
  })();

// Swagger setup
const swaggerOptions = {
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'Your API Title',
        version: '1.0.0',
        description: 'Description of your API',
      },
    },
    apis: ['./routes/*.js'],
  };
  
  const swaggerSpec = swaggerJSDoc(swaggerOptions);
  app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerSpec));

  
  

// Routes
app.use('/auth', validationMiddleware,authRoutes);
app.use('/game', authMiddleware,validationMiddleware,gameRoutes);

// Error handling middleware
app.use(errorMiddleware);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`); 
});

module.exports = app;
