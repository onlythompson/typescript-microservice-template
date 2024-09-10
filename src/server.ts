import 'reflect-metadata';  // Required for tsyringe
import express from 'express';
import helmet from 'helmet';
import compression from 'compression';
import swaggerUi from 'swagger-ui-express';
import { container } from './container';
import { APP_CONFIG } from './cross_cutting/config/app';
// import routes from './interfaces/http/routes';
import { logger } from './cross_cutting/logging';
import { mongoPersistenceConnection } from './infrastructure/persistence/mongodb/MongoPersistenceConnection';
import swaggerSpec from './cross_cutting/config/swagger';
import { loggerMiddleware } from './cross_cutting/logging';
import { errorMiddleware } from './cross_cutting/error_handling';
import { corsMiddleware } from './interfaces/http/middlewares/cors_middleware';

class Server {
  private app: express.Application;

  constructor() {
    this.app = express();
    this.configureMiddleware();
    this.configureRoutes();
    this.configureErrorHandling();
  }

  private configureMiddleware(): void {
    // Security middleware
    this.app.use(helmet());

    // CORS middleware
    this.app.use(corsMiddleware);

    // Body parsing middleware
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));

    // Compression middleware
    this.app.use(compression());

    // Logging middleware
    this.app.use(loggerMiddleware);
  }

  private configureRoutes(): void {
    // Swagger API documentation
    this.app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

    // API routes
    // this.app.use(routes);

    // Health check route
    this.app.get('/health', (req, res) => {
      res.status(200).json({ status: 'OK' });
    });

    // 404 handler
    this.app.use((req, res) => {
      res.status(404).json({ error: 'Not Found' });
    });
  }

  private configureErrorHandling(): void {
    this.app.use(errorMiddleware);
  }

  public async start(): Promise<void> {
    let retryAttempts = 0;
    const maxRetryAttempts = 5;
    const baseRetryInterval = 2000; // 2 second

    const retryConnection = async () => {
      try {
        // Connect to database
        await mongoPersistenceConnection.connect();

        // Seed the database
        await mongoPersistenceConnection.seedDatabase();

        // Start the server
        this.app.listen(APP_CONFIG.port, () => {
          logger.info(`Server running on port ${APP_CONFIG.port}`);
          retryAttempts = 0;
        });
      } catch (error) {
        logger.error('Failed to start server:', error);
        if (error instanceof Error) {
          logger.error('Error message:', error.message);
          logger.error('Stack trace:', error.stack);
        }
        if (APP_CONFIG.environment !== 'production') {
          process.exit(1);
        }
        if (retryAttempts < maxRetryAttempts) {
          retryAttempts++;
          const retryInterval = baseRetryInterval * Math.pow(2, retryAttempts);
          logger.warn(`Retrying server in ${retryInterval / 1000} seconds... (Attempt ${retryAttempts})`);
          setTimeout(retryConnection, retryInterval);
        } else {
          logger.error('Max retry attempts reached. Exiting...');
          process.exit(1); // Terminate the application after max retry attempts
        }
      }
    };
    retryConnection();
  }
}

// Create and start the server
const server = new Server();
server.start().catch((error) => {
  logger.error('Unhandled error:', error);
  if (error instanceof Error) {
    logger.error('Error message:', error.message);
    logger.error('Stack trace:', error.stack);
  }

  if(APP_CONFIG.environment !== 'production') {
    process.exit(1);
  }

  //Implement Monitoring and Alerting for production

});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  // logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
  logger.error(`Unhandled Rejection at: {promise}`, reason);
  // Application specific logging, throwing an error, or other logic here
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error);
  logger.error('Stack trace:', error.stack);
  // Application specific logging, throwing an error, or other logic here
  if (APP_CONFIG.environment !== 'production') {
    process.exit(1);
  }
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  logger.info('SIGTERM signal received: closing HTTP server and database connection');
  await mongoPersistenceConnection.closeConnection();
});

export default server;