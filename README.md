# Node.js/TypeScript API Project Template

## Table of Contents
1. [Introduction](#introduction)
2. [Features](#features)
3. [Project Structure](#project-structure)
4. [Getting Started](#getting-started)
   - [Prerequisites](#prerequisites)
   - [Installation](#installation)
   - [Configuration](#configuration)
5. [Architecture](#architecture)
   - [Clean Architecture](#clean-architecture)
   - [Dependency Injection](#dependency-injection)
6. [API Documentation](#api-documentation)
7. [Database](#database)
8. [Caching](#caching)
9. [Messaging](#messaging)
10. [Cross-Cutting Concerns](#cross-cutting-concerns)
    - [Logging](#logging)
    - [Error Handling](#error-handling)
    - [Metrics](#metrics)
    - [Tracing](#tracing)
11. [Testing](#testing)
12. [Deployment](#deployment)
13. [Contributing](#contributing)
14. [License](#license)

## Introduction

This project is a robust Node.js/TypeScript API template implementing clean architecture principles. It provides a solid foundation for building scalable, maintainable, and testable backend applications.

## Features

- **TypeScript**: Strongly typed language for better developer experience and fewer runtime errors
- **Express.js**: Fast, unopinionated, minimalist web framework for Node.js
- **Clean Architecture**: Clear separation of concerns for better maintainability
- **MongoDB with Mongoose**: Flexible and powerful ODM for MongoDB
- **Redis Caching**: Improved performance with in-memory data caching
- **RabbitMQ Messaging**: Reliable message queuing for asynchronous processing
- **Swagger Documentation**: Interactive API documentation
- **Jest Testing**: Comprehensive unit and integration testing setup
- **Docker Support**: Containerization for consistent development and deployment environments
- **Logging (Winston)**: Advanced logging capabilities
- **Error Handling**: Centralized error handling and custom error classes
- **Metrics (Prometheus)**: Application metrics collection and exposure
- **Distributed Tracing (OpenTelemetry)**: Request tracing across services
- **ESLint & Prettier**: Code linting and formatting for consistent style
- **Husky & lint-staged**: Pre-commit hooks for code quality
- **CI/CD**: Sample GitHub Actions workflow

## Project Structure

```
.
├── src/
│   ├── application/        # Application business logic
│   ├── domain/             # Domain entities and interfaces
│   ├── infrastructure/     # External services implementations
│   ├── interfaces/         # Controllers, routes
│   ├── cross_cutting/      # Cross-cutting concerns (logging, error handling, etc.)
│   ├── config/             # Configuration files
│   └── server.ts           # Express app setup
├── tests/                  # Test files
├── docs/                   # Additional documentation
├── scripts/                # Utility scripts
├── .env.example            # Example environment variables
├── .eslintrc.js            # ESLint configuration
├── .prettierrc             # Prettier configuration
├── jest.config.js          # Jest configuration
├── tsconfig.json           # TypeScript configuration
├── Dockerfile              # Docker configuration
├── docker-compose.yml      # Docker Compose configuration
└── README.md               # Project documentation
```

## Getting Started

### Prerequisites

- Node.js (v14+)
- npm or yarn
- Docker and Docker Compose (for containerized development)
- MongoDB
- Redis
- RabbitMQ

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/your-repo-name.git
   cd your-repo-name
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   ```
   Edit the `.env` file with your specific configuration.

4. Start the development server:
   ```bash
   npm run dev
   ```

### Configuration

Configuration is managed through environment variables and the `config` directory. Key configuration files:

- `src/config/app.ts`: Application-wide settings
- `src/config/database.ts`: Database connection settings
- `src/config/cache.ts`: Caching configuration
- `src/config/messaging.ts`: Message queue settings
- `src/config/observability.ts`: Logging, metrics, and tracing configuration

## Architecture

### Clean Architecture

This project follows clean architecture principles, separating the codebase into layers:

1. **Domain Layer**: Core business logic and entities
2. **Application Layer**: Use cases and application-specific business rules
3. **Infrastructure Layer**: Implementations of interfaces defined in the domain layer
4. **Interfaces Layer**: Controllers, routes, and adapters for external agencies

### Dependency Injection

Dependency injection is implemented using `tsyringe`. Example usage:

```typescript
// src/infrastructure/repositories/UserRepository.ts
import { injectable } from 'tsyringe';
import { IUserRepository } from '../../domain/repositories/IUserRepository';

@injectable()
export class UserRepository implements IUserRepository {
  // Implementation
}

// src/application/services/UserService.ts
import { injectable, inject } from 'tsyringe';
import { IUserRepository } from '../../domain/repositories/IUserRepository';

@injectable()
export class UserService {
  constructor(
    @inject('IUserRepository') private userRepository: IUserRepository
  ) {}

  // Service methods
}

// src/interfaces/http/controllers/UserController.ts
import { injectable, inject } from 'tsyringe';
import { UserService } from '../../../application/services/UserService';

@injectable()
export class UserController {
  constructor(
    @inject(UserService) private userService: UserService
  ) {}

  // Controller methods
}
```

## API Documentation

API documentation is generated using Swagger. Access the Swagger UI at `http://localhost:3000/api-docs` when running the application.

To document an API endpoint, use Swagger JSDoc comments:

```typescript
/**
 * @swagger
 * /users:
 *   get:
 *     summary: Retrieve a list of users
 *     responses:
 *       200:
 *         description: A list of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 */
router.get('/users', userController.getUsers);
```

## Database

This template uses MongoDB with Mongoose as the ODM. Database operations are abstracted through repository interfaces.

Example usage:

```typescript
// src/infrastructure/repositories/MongoUserRepository.ts
import { injectable } from 'tsyringe';
import { IUserRepository } from '../../domain/repositories/IUserRepository';
import { UserModel } from '../models/UserModel';

@injectable()
export class MongoUserRepository implements IUserRepository {
  async findById(id: string): Promise<User | null> {
    return UserModel.findById(id).exec();
  }

  // Other repository methods
}
```

## Caching

Redis is used for caching. The caching layer is implemented in the infrastructure layer and can be injected into services.

Example usage:

```typescript
// src/infrastructure/cache/RedisCache.ts
import { injectable } from 'tsyringe';
import { createClient } from 'redis';
import { CACHE_CONFIG } from '../../config/cache';

@injectable()
export class RedisCache implements ICache {
  private client;

  constructor() {
    this.client = createClient(CACHE_CONFIG);
    this.client.connect();
  }

  async get(key: string): Promise<string | null> {
    return this.client.get(key);
  }

  async set(key: string, value: string, ttl?: number): Promise<void> {
    await this.client.set(key, value, { EX: ttl });
  }

  // Other cache methods
}

// Usage in a service
@injectable()
export class UserService {
  constructor(
    @inject('IUserRepository') private userRepository: IUserRepository,
    @inject('ICache') private cache: ICache
  ) {}

  async getUserById(id: string): Promise<User | null> {
    const cachedUser = await this.cache.get(`user:${id}`);
    if (cachedUser) {
      return JSON.parse(cachedUser);
    }

    const user = await this.userRepository.findById(id);
    if (user) {
      await this.cache.set(`user:${id}`, JSON.stringify(user), 3600); // Cache for 1 hour
    }

    return user;
  }
}
```

## Messaging

RabbitMQ is used for message queuing. The messaging layer is implemented in the infrastructure layer.

Example usage:

```typescript
// src/infrastructure/messaging/RabbitMQClient.ts
import { injectable } from 'tsyringe';
import { connect, Connection, Channel } from 'amqplib';
import { MESSAGING_CONFIG } from '../../config/messaging';

@injectable()
export class RabbitMQClient implements IMessageQueue {
  private connection: Connection;
  private channel: Channel;

  async initialize(): Promise<void> {
    this.connection = await connect(MESSAGING_CONFIG.rabbitMQ.url);
    this.channel = await this.connection.createChannel();
  }

  async publishMessage(queue: string, message: string): Promise<void> {
    await this.channel.assertQueue(queue, { durable: true });
    this.channel.sendToQueue(queue, Buffer.from(message));
  }

  // Other messaging methods
}

// Usage in a service
@injectable()
export class NotificationService {
  constructor(
    @inject('IMessageQueue') private messageQueue: IMessageQueue
  ) {}

  async sendNotification(userId: string, message: string): Promise<void> {
    await this.messageQueue.publishMessage('notifications', JSON.stringify({ userId, message }));
  }
}
```

## Cross-Cutting Concerns

### Logging

Logging is implemented using Winston. A custom logger is created in `src/cross_cutting/logging/logger.ts`.

Example usage:

```typescript
import { logger } from '../../cross_cutting/logging/logger';

logger.info('User logged in', { userId: user.id });
logger.error('Failed to process payment', { error: err.message, userId: user.id });
```

### Error Handling

Centralized error handling is implemented in `src/cross_cutting/error_handling/errorHandler.ts`.

Example usage:

```typescript
import { AppError, asyncHandler } from '../../cross_cutting/error_handling';

export const createUser = asyncHandler(async (req: Request, res: Response) => {
  const { email } = req.body;
  const existingUser = await userService.findByEmail(email);
  if (existingUser) {
    throw new AppError('User already exists', 400);
  }
  // Create user logic
});
```

### Metrics

Prometheus is used for metrics collection. Metrics are set up in `src/cross_cutting/metrics/metricsCollector.ts`.

Example usage:

```typescript
import { metricsCollector } from '../../cross_cutting/metrics/metricsCollector';

// In your route handler
metricsCollector.httpRequestsTotal.inc({ method: req.method, path: req.path });

// Custom metric
const databaseQueryDuration = metricsCollector.createHistogram({
  name: 'database_query_duration_seconds',
  help: 'Duration of database queries in seconds',
  labelNames: ['operation'],
});

const end = databaseQueryDuration.startTimer();
// Perform database query
end({ operation: 'findUser' });
```

### Tracing

Distributed tracing is implemented using OpenTelemetry. Tracing is set up in `src/cross_cutting/tracing/tracer.ts`.

Example usage:

```typescript
import { tracer } from '../../cross_cutting/tracing/tracer';

const span = tracer.startSpan('createUser');
try {
  // User creation logic
  span.setStatus({ code: SpanStatusCode.OK });
} catch (error) {
  span.setStatus({ code: SpanStatusCode.ERROR, message: error.message });
  throw error;
} finally {
  span.end();
}
```

## Testing

Jest is used for testing. Run tests with:

```bash
npm test
```

Example test:

```typescript
// src/application/services/__tests__/UserService.test.ts
import { container } from 'tsyringe';
import { UserService } from '../UserService';
import { MockUserRepository } from '../../__mocks__/MockUserRepository';

describe('UserService', () => {
  let userService: UserService;
  let mockUserRepository: MockUserRepository;

  beforeEach(() => {
    mockUserRepository = new MockUserRepository();
    container.registerInstance('IUserRepository', mockUserRepository);
    userService = container.resolve(UserService);
  });

  it('should create a user', async () => {
    const userData = { name: 'John Doe', email: 'john@example.com' };
    await userService.createUser(userData);
    expect(mockUserRepository.create).toHaveBeenCalledWith(userData);
  });
});
```

## Deployment

This project includes a Dockerfile and docker-compose.yml for containerized deployment.

Build and run with Docker Compose:

```bash
docker-compose up --build
```

For production deployment, consider using Kubernetes or a managed container service like AWS ECS.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.