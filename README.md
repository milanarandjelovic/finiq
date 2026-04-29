# Finiq

Finiq is a personal finance management application for tracking transactions, budgets, categories, and statistics. It is built as a full-stack monorepo targeting web and mobile platforms.

Finiq gives individuals full visibility and control over their personal finances - across web and mobile. You can record every income and expense, organise them into colour-coded emoji categories, set monthly budgets per category, and track savings goals with target amounts and deadlines. A statistics module surfaces 6-month income/expense trends and a per-category spending breakdown so patterns are immediately obvious. On the dashboard you see a live month summary: total income, total expenses, balance, and a "ready to assign" figure showing unbudgeted income still available for planning.

**Transactions** are the core of the app. Each entry has a type (income or expense), amount, date, optional note, optional category, and an optional receipt file you can upload and retrieve later. The transaction list supports filtering by month/year, type, and category name, with pagination throughout.

**Budgets** are set per category per month. A single action copies last month's budgets to the current month, making recurring monthly planning fast. The dashboard shows budgeted vs. spent per category with a progress bar and an "over budget" badge when a limit is exceeded.

**Categories** are fully customisable - name, hex colour, and emoji icon. They split into two kinds: regular spending categories (used for budgets and transactions) and goal categories (savings goals with a target amount and target date). Both kinds live in the same management UI with filtering between them.

**Settings** store per-user preferences such as the display currency (default USD), with an extensible key-value model for future options.

Authentication uses JWT access/refresh tokens with email verification, forgot-password/reset flows, and standard profile management.

---

## Apps

| App                  | Stack                                 | Description                                                    |
| -------------------- | ------------------------------------- | -------------------------------------------------------------- |
| `@finiq/api`         | NestJS, TypeORM, PostgreSQL           | REST API with JWT auth, Swagger docs, migrations, and seeders  |
| `@finiq/web`         | Next.js 16, React 19, Tailwind CSS v4 | Web dashboard with transaction management, budgets, and charts |
| `@finiq/mobile`      | Expo (React Native)                   | Mobile client sharing schemas and hooks with the web app       |
| `@finiq/i18n-static` | NestJS                                | Static internationalization assets                             |

## Packages

| Package                    | Description                                    |
| -------------------------- | ---------------------------------------------- |
| `@finiq/ui`                | Shared React component library                 |
| `@finiq/hooks`             | Shared React hooks (Orval-generated API hooks) |
| `@finiq/schemas`           | Shared Zod validation schemas                  |
| `@finiq/shared`            | Shared types and utilities used across apps    |
| `@finiq/eslint-config`     | Shared ESLint configurations                   |
| `@finiq/prettier-config`   | Shared Prettier configuration                  |
| `@finiq/tailwind-config`   | Shared Tailwind CSS v4 base styles             |
| `@finiq/typescript-config` | Shared `tsconfig.json` presets                 |

## Tech Stack

- **Runtime**: Bun
- **Monorepo**: Turborepo
- **Language**: TypeScript (all packages)
- **Database**: PostgreSQL via TypeORM
- **API**: NestJS with Swagger / ReDoc
- **Web**: Next.js + TanStack Query + React Hook Form + Recharts
- **Mobile**: Expo + React Native
- **Styling**: Tailwind CSS v4

## Getting Started

Install dependencies:

```sh
bun install
```

### Development

Run all apps in development mode:

```sh
bun dev
```

Run a specific app:

```sh
bun dev --filter=@finiq/web
bun dev --filter=@finiq/api
bun dev --filter=@finiq/mobile
```

### Build

```sh
bun build
```

### Database

```sh
bun db:create              # Create the database
bun db:migration:run       # Run pending migrations
bun db:seed:run            # Run seeders
bun db:migration:generate  # Generate a new migration (use --name=<name>)
bun db:migration:revert    # Revert the last migration
```

### API Generation

Regenerate typed API hooks for the web app from the OpenAPI spec:

```sh
bun web:generate:api
```

### Other Commands

```sh
bun lint            # Lint all packages
bun check-types     # Type-check all packages
bun format          # Format all files with Prettier
bun run clean       # Clean all build artifacts and node_modules
```
