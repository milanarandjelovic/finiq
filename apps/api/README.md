# `@finiq/api`

The main NestJS backend for Finiq. Provides a REST API covering authentication, budgets, categories, goals, transactions, statistics, and user settings, backed by PostgreSQL via TypeORM.

## Tech Stack

- [NestJS 11](https://nestjs.com) - framework
- [TypeORM](https://typeorm.io) - database ORM with migration support
- [PostgreSQL](https://www.postgresql.org) - primary database
- [Passport](https://www.passportjs.org) + JWT - authentication
- [Swagger / Redoc](https://swagger.io) - API documentation
- [Nodemailer](https://nodemailer.com) + Handlebars - transactional email
- [Jest](https://jestjs.io) - unit and E2E tests

## Getting Started

```sh
cp .env.example .env
bun install
bun dev --filter=@finiq/api
```

## Database

```sh
# Generate a migration
npm run migration:generate --name=create-users-table

# Run migrations
npm run migration:run

# Run seeds
npm run seed:run
```

## Scripts

| Command          | Description                    |
| ---------------- | ------------------------------ |
| `bun dev`        | Start development server       |
| `bun build`      | Build for production           |
| `bun start:prod` | Start production build         |
| `bun test`       | Run unit tests                 |
| `bun test:e2e`   | Run E2E tests                  |
| `bun lint`       | Lint and auto-fix source files |
