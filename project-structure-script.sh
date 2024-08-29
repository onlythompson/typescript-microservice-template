#!/bin/bash

# Function to create directory and its parent directories if they don't exist
create_dir() {
    mkdir -p "$1"
    echo "Created directory: $1"
}

# Function to create an empty file
create_file() {
    touch "$1"
    echo "Created file: $1"
}

# Create root directory
create_dir "task-management-app"
cd "task-management-app"

# Create src directory and its subdirectories
create_dir "src/domain/task/entities"
create_dir "src/domain/task/value-objects"
create_dir "src/domain/task/repositories"
create_dir "src/domain/task/services"
create_dir "src/domain/user/entities"
create_dir "src/domain/user/value-objects"
create_dir "src/domain/user/repositories"
create_dir "src/domain/user/services"

create_dir "src/application/task/services"
create_dir "src/application/task/use-cases"
create_dir "src/application/task/dto"
create_dir "src/application/task/serializers"
create_dir "src/application/user/services"
create_dir "src/application/user/use-cases"
create_dir "src/application/user/dto"
create_dir "src/application/user/serializers"

create_dir "src/infrastructure/persistence/mongodb/models"
create_dir "src/infrastructure/persistence/mongodb/repositories"
create_dir "src/infrastructure/persistence/migrations"
create_dir "src/infrastructure/caching/redis"
create_dir "src/infrastructure/caching/in-memory"
create_dir "src/infrastructure/messaging/rabbitmq"
create_dir "src/infrastructure/messaging/kafka"
create_dir "src/infrastructure/external-services/email"
create_dir "src/infrastructure/external-services/payment"

create_dir "src/interfaces/http/controllers"
create_dir "src/interfaces/http/middlewares"
create_dir "src/interfaces/http/routes"
create_dir "src/interfaces/http/validators"
create_dir "src/interfaces/http/errors"
create_dir "src/interfaces/graphql/schema"
create_dir "src/interfaces/graphql/resolvers"
create_dir "src/interfaces/graphql/directives"

create_dir "src/cross_cutting/logging"
create_dir "src/cross_cutting/monitoring"
create_dir "src/cross_cutting/observability"
create_dir "src/cross_cutting/error-handling"

create_dir "src/config"
create_dir "src/utils"

create_dir "tests/unit"
create_dir "tests/integration"
create_dir "tests/e2e"
create_dir "tests/performance"

create_dir "scripts"
create_dir "docs"
create_dir "locales"

# Create important files
create_file "src/server.ts"
create_file "src/container.ts"
create_file ".env.example"
create_file "Dockerfile"
create_file "docker-compose.yml"
create_file "package.json"
create_file "tsconfig.json"
create_file "README.md"

# Create config files
create_file "src/config/app.ts"
create_file "src/config/database.ts"
create_file "src/config/cache.ts"
create_file "src/config/messaging.ts"
create_file "src/config/logging.ts"
create_file "src/config/monitoring.ts"
create_file "src/config/external-services.ts"

# Create project-wide configuration files
create_file ".gitignore"
create_file "jest.config.js"
create_file ".eslintrc.js"
create_file ".prettierrc"

echo "Project structure created successfully!"
