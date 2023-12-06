// app.js
const express = require('express');
const bodyParser = require('body-parser');
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUI = require('swagger-ui-express');
const mongoose = require('mongoose');
const amqp = require('amqplib');
const cors = require("cors");
const authRoutes = require('./routes/authRoutes');
const gameRoutes = require('./routes/gameRoutes');
const userRouter = require('./routes/user.route');
const errorMiddleware = require('./middleware/errorMiddleware');
const validationMiddleware = require('./middleware/validationMiddleware');
const authMiddleware = require('./middleware/auth.middleware');
const { HttpException } = require('./utils/errors');


// Init environment
require('dotenv').config();
// Init express
const app = express();

// parse requests of content-type: application/json
// parses incoming requests with JSON payloads
app.use(express.json());
// enabling cors for all requests by using cors middleware
app.use(cors());
// Enable pre-flight
app.options("*", cors());


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
app.use(`/api/v1/users`,validationMiddleware, userRouter);
app.use('/api/v1/auth', validationMiddleware,authRoutes);
app.use('/api/v1/game', authMiddleware,validationMiddleware,gameRoutes);

// 404 error
app.all('*', (req, res, next) => {
    const err = new HttpException(404, 'Endpoint Not Found');
    next(err);
});

// Error handling middleware
app.use(errorMiddleware);

const port = Number(process.env.PORT || 3000); 
// starting the server
app.listen(port, () =>
    console.log(`🚀 Server running on port ${port}!`));

module.exports = app;
