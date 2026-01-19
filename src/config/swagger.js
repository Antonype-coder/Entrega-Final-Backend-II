import swaggerJSDoc from 'swagger-jsdoc';

export const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Ecommerce',
      version: '1.0.0',
      description: 'Documentación del módulo Users'
    },
    servers: [
      { url: 'http://localhost:3000' }
    ]
  },
  apis: ['./src/docs/*.js']
};

export const swaggerSpec = swaggerJSDoc(swaggerOptions);
