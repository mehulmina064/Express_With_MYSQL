const swaggerAutogen = require('swagger-autogen')();

const outputFile = './swagger_output.json';
const endpointsFiles = ['./app.js']; 

const swaggerOptions = {
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'GAME API WITH USER FLOW',
        version: '1.0.0',
        description: 'Description of your API',
      },
      components: {
        schemas: {
          User: {
            type: 'object',
            properties: {
              id: { type: 'integer' },
              name: { type: 'string' },
              // Add other properties as needed
            },
          },
          // Add more models as needed
        },
      },
    },
    apis: ['./routes/*.js'],
  };

swaggerAutogen(outputFile, endpointsFiles,swaggerOptions);
