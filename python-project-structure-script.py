import os

def create_directory(path):
    os.makedirs(path, exist_ok=True)

def create_file(path):
    open(path, 'a').close()

# Create root directory
root_dir = "task-management-app"
create_directory(root_dir)
os.chdir(root_dir)

# Create main directory structure
directories = [
    "src/application/task/services",
    "src/application/task/use-cases",
    "src/application/task/dto",
    "src/application/task/serializers",
    "src/application/user/services",
    "src/application/user/use-cases",
    "src/application/user/dto",
    "src/application/user/serializers",
    "src/domain/task",
    "src/domain/user",
    "src/infrastructure/persistence/mongodb",
    "src/infrastructure/caching/redis",
    "src/infrastructure/caching/memcached",
    "src/infrastructure/messaging/rabbitmq",
    "src/infrastructure/messaging/kafka",
    "src/infrastructure/external-services/email",
    "src/infrastructure/external-services/payment",
    "src/interfaces/http/controllers",
    "src/interfaces/http/middlewares",
    "src/interfaces/http/routes",
    "src/interfaces/http/validations",
    "src/interfaces/graphql/schema",
    "src/interfaces/graphql/resolvers",
    "src/interfaces/graphql/directives",
    "src/cross_cutting/logging",
    "src/cross_cutting/metrics",
    "src/cross_cutting/tracing",
    "src/cross_cutting/error_handling",
    "src/cross_cutting/config",
    "tests/unit",
    "tests/integration",
    "tests/e2e",
    "scripts"
]

for directory in directories:
    create_directory(directory)

# Create files
files = [
    "src/server.ts",
    "src/container.ts",
    "src/cross_cutting/config/app.ts",
    "src/cross_cutting/config/db.ts",
    "src/cross_cutting/config/cache.ts",
    "src/cross_cutting/config/messaging.ts",
    "src/cross_cutting/config/observability.ts",
    "src/cross_cutting/config/external-services.ts",
    "src/infrastructure/caching/redis/RedisClient.ts",
    "src/infrastructure/caching/redis/RedisCacheService.ts",
    "src/infrastructure/messaging/rabbitmq/RabbitMQClient.ts",
    "src/infrastructure/messaging/rabbitmq/RabbitMQService.ts",
    "src/infrastructure/external-services/email/EmailService.ts",
    "src/infrastructure/external-services/payment/PaymentGatewayService.ts",
    "src/interfaces/graphql/schema/task.graphql",
    "src/interfaces/graphql/schema/user.graphql",
    "src/interfaces/graphql/resolvers/taskResolvers.ts",
    "src/interfaces/graphql/resolvers/userResolvers.ts",
    "src/interfaces/graphql/directives/authDirective.ts",
    "scripts/generateSwaggerDocs.ts",
    "scripts/seedDatabase.ts",
    ".env",
    ".env.example",
    ".gitignore",
    ".prettierrc",
    ".eslintrc.js",
    "jest.config.js",
    "Dockerfile",
    "docker-compose.yml",
    "package.json",
    "tsconfig.json",
    "README.md"
]

for file in files:
    create_file(file)

print("Project structure created successfully!")
