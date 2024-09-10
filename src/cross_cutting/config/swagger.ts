import swaggerJsdoc from 'swagger-jsdoc';
import { APP_CONFIG } from './app';
import { SwaggerUiOptions } from 'swagger-ui-express';
import { version } from '../../../package.json';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Microservices API',
      version,
      description: 'API documentation for Microservice Application',
    },
    servers: [
      {
        url: `http://localhost:${APP_CONFIG.port}`,
        description: 'Development server',
      },
    ],
  },
  apis: ['./src/interfaces/http/routes/*.ts', './src/interfaces/http/controllers/*.ts', './src/interfaces/http/swagger_definitions/*.yaml', './src/interfaces/http/schemas/request/*.yaml'],
};

const swaggerSpec = swaggerJsdoc(options);

export const swaggerUiOptions: SwaggerUiOptions = {
  // customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: "Microservices API Documentation",
  customfavIcon: "/public/favicon.ico",
  swaggerOptions: {
    defaultModelsExpandDepth: -1, // Hide schemas section by default
    docExpansion: 'none', // Collapse all endpoints by default
  },
  customCssUrl: 'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.17.14/swagger-ui.min.css',
};

export default swaggerSpec;