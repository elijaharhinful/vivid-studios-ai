# Vivid Studios AI - Monorepo

A production-ready AI-powered character generation platform built with Nx, Next.js, and NestJS.

## 🏗️ Architecture

This is an Nx monorepo containing:

- **apps/web** - Next.js 16 frontend with App Router and TailwindCSS
- **apps/api** - NestJS backend with TypeORM, PostgreSQL, MinIO, and Redis
- **libs/shared-types** - Shared TypeScript types and DTOs

## 📋 Prerequisites

- Node.js 20.x or higher
- npm 10.x or higher
- Docker and Docker Compose (for infrastructure)
- PostgreSQL 16 (if not using Docker)
- Redis 7 (if not using Docker)
- MinIO (if not using Docker)

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Environment Variables

Copy the example environment file:

```bash
cp .env.example .env
```

Edit `.env` with your configuration.

### 3. Start Infrastructure (Docker)

```bash
docker-compose up -d
```

This will start:
- PostgreSQL on port 5432
- Redis on port 6379
- MinIO on ports 9000 (API) and 9001 (Console)

### 4. Run Database Migrations

```bash
npm run migration:run
```

### 5. Start Development Servers

```bash
# Start both web and API
npm run dev

# Or start individually
npm run dev:web  # Next.js on http://localhost:4200
npm run dev:api  # NestJS on http://localhost:3000
```

## 📦 Project Structure

```
vivid-studios-ai/
├── apps/
│   ├── web/                    # Next.js frontend
│   │   ├── src/
│   │   │   ├── app/           # App Router pages
│   │   │   │   ├── (auth)/    # Auth pages (login, signup, reset)
│   │   │   │   ├── dashboard/
│   │   │   │   ├── characters/
│   │   │   │   ├── generate/
│   │   │   │   └── gallery/
│   │   └── public/
│   │
│   └── api/                    # NestJS backend
│       ├── src/
│       │   ├── app/
│       │   ├── config/        # Configuration module
│       │   ├── database/      # TypeORM config
│       │   └── modules/       # Feature modules
│       │       ├── auth/
│       │       ├── users/
│       │       ├── characters/
│       │       ├── reference-images/
│       │       ├── character-training-images/
│       │       ├── generation-sessions/
│       │       ├── generation-settings/
│       │       ├── generated-images/
│       │       ├── refinement-jobs/
│       │       ├── image-tags/
│       │       ├── generated-image-tags/
│       │       ├── collections/
│       │       ├── collection-images/
│       │       ├── subscriptions/
│       │       ├── credit-transactions/
│       │       ├── payment-transactions/
│       │       ├── shared-images/
│       │       ├── user-preferences/
│       │       ├── pose-library/
│       │       ├── activity-logs/
│       │       └── notification-queue/
│       └── docs/              # Swagger documentation per module
│
├── libs/
│   └── shared-types/          # Shared TypeScript types
│       └── src/
│           ├── entities/      # TypeORM entities
│           ├── dtos/          # Data Transfer Objects
│           └── interfaces/    # TypeScript interfaces
│
├── docker-compose.yml         # Infrastructure services
├── nx.json                    # Nx configuration
├── tsconfig.base.json         # Base TypeScript config
└── package.json               # Dependencies and scripts
```

## 🛠️ Available Scripts

### Development
- `npm run dev` - Start both web and API in parallel
- `npm run dev:web` - Start Next.js dev server
- `npm run dev:api` - Start NestJS dev server

### Building
- `npm run build` - Build all projects
- `npm run build:web` - Build Next.js app
- `npm run build:api` - Build NestJS app

### Testing
- `npm test` - Run all tests
- `npm run test:web` - Test Next.js app
- `npm run test:api` - Test NestJS app

### Linting & Formatting
- `npm run lint` - Lint all projects
- `npm run lint:fix` - Fix linting issues
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting

### Database Migrations
- `npm run migration:generate -- -n MigrationName` - Generate migration
- `npm run migration:run` - Run pending migrations
- `npm run migration:revert` - Revert last migration

## 🔒 Code Quality

This project enforces strict code quality standards:

- **No `any` types** - TypeScript strict mode with `noImplicitAny`
- **ESLint** - Enforces coding standards
- **Prettier** - Consistent code formatting
- **Husky** - Git hooks for quality checks
  - Pre-commit: Runs lint-staged (ESLint + Prettier on staged files)
  - Pre-push: Runs linting, format check, and tests

## 🗄️ Database

The project uses PostgreSQL with TypeORM for data persistence.

### Entities

All entities are defined in `libs/shared-types/src/entities/` and include:

- User, Character, ReferenceImage
- CharacterTrainingImage, GenerationSession
- GenerationSettings, GeneratedImage
- RefinementJob, ImageTag, GeneratedImageTag
- Collection, CollectionImage
- Subscription, CreditTransaction, PaymentTransaction
- SharedImage, UserPreference, PoseLibrary
- ActivityLog, NotificationQueue

## 📚 API Documentation

Swagger documentation is available at `http://localhost:3000/docs/api` when running the API in development mode.

Each NestJS module has its own `/docs` folder containing Swagger decorators and API documentation.

## 🔐 Authentication

The API uses JWT-based authentication with refresh tokens:

- Access tokens expire in 15 minutes
- Refresh tokens expire in 7 days
- Passwords are hashed with bcrypt
- Role-Based Access Control (RBAC) with roles: `super_admin`, `admin`, `user`

## 💾 Storage

MinIO is used for S3-compatible object storage with the following buckets:

- `uploaded-images` - User-uploaded reference images
- `generated-results` - AI-generated images
- `character-training-assets` - Training data for character models
- `documents` - Document storage

## 🔄 Job Queues

BullMQ with Redis is used for background job processing:

- Image generation jobs
- Training jobs
- Email notifications
- Webhook processing

## 🌐 Infrastructure

### Using Docker (Recommended)

```bash
docker-compose up -d
```

### Without Docker

1. **PostgreSQL**: Install and create database `vivid_studios_db`
2. **Redis**: Install and run on port 6379
3. **MinIO**: Install and configure buckets manually

Update `.env` with your local service URLs.

## 🚢 Deployment

### Build for Production

```bash
npm run build
```

### Environment Variables

Ensure all production environment variables are set:
- Update JWT secrets
- Configure production database
- Set up production MinIO/S3
- Configure Redis connection

## 📝 License

ISC

## 👥 Contributing

1. Create a feature branch
2. Make your changes
3. Ensure all tests pass
4. Ensure linting passes
5. Submit a pull request

---

Built with ❤️ using Nx, Next.js, and NestJS
