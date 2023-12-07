// app.js
const express = require('express');
const bodyParser = require('body-parser');
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUI = require('swagger-ui-express');
const mongoose = require('mongoose');
const amqp = require('amqplib');
const cors = require("cors");
const gameRoutes = require('./routes/gameRoutes');
const userRouter = require('./routes/user.route');
const errorMiddleware = require('./middleware/errorMiddleware');
const { HttpException } = require('./utils/errors');
const responseHandler = require('./middleware/responseHandler');

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

// Swagger setup manually
// const swaggerOptions = {
//     definition: {
//       openapi: '3.0.0',
//       info: {
//         title: 'Your API Title',
//         version: '1.0.0',
//         description: 'Description of your API',
//       },
//     },
//     apis: ['./routes/*.js'],
//   };

//manually configure
//   const swaggerSpec = swaggerJSDoc(swaggerOptions);
//   app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerSpec)); 
  
  //automated with less details
  const swaggerDocument = require('./swagger_output.json');
  app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument));


// Use the response handler middleware
app.use(responseHandler);

// Routes
app.use(`/api/v1/users`, userRouter);
app.use('/api/v1/game',gameRoutes);

// Error handling middleware
app.use(errorMiddleware);

// 404 error
app.all('*', (req, res, next) => {
    const err = new HttpException(404, 'Endpoint Not Found');
    next(err);
});


const port = Number(process.env.PORT || 3000); 
// starting the server
app.listen(port, () =>
    console.log(`🚀 Server running on port ${port}!`));

module.exports = app;
