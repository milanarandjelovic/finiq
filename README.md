# Finiq

Finiq is a personal finance management application for tracking transactions, budgets, categories, and statistics. It is built as a full-stack monorepo targeting web and mobile platforms.

---

## Project Structure

The repo is a Turborepo monorepo. `apps/` contains runnable applications; `packages/` contains shared libraries consumed by those apps; `tooling/` contains shared config only (no runtime code).

```
finiq/
├── apps/
│   ├── web/                            # Next.js 16 App Router - main web application
│   ├── api/                            # NestJS REST API
│   ├── mobile/                         # Expo (React Native) mobile client
│   └── i18n-static/                    # NestJS static i18n assets service
│
├── packages/
│   ├── ui/                             # Shared React component library
│   │   └── src/
│   │       ├── components/             # Avatar, Badge, Button, Card, Checkbox,
│   │       │                           # Dialog, DropdownMenu, Form, Input, Label,
│   │       │                           # LoadingButton, PasswordInput, Popover,
│   │       │                           # Select, Separator, Sheet, Sidebar,
│   │       │                           # Skeleton, Sonner, Switch, Table, Tooltip
│   │       ├── hooks/use-mobile.ts
│   │       └── lib/utils.ts            # cn() - clsx + tailwind-merge helper
│   │
│   ├── schemas/                        # Zod validation schemas
│   │   └── src/
│   │       ├── auth/
│   │       │   ├── login.schema.ts
│   │       │   ├── register.schema.ts
│   │       │   ├── forgot-password.schema.ts
│   │       │   └── reset-password.schema.ts
│   │       ├── budget/budget.schema.ts
│   │       ├── category/category.schema.ts
│   │       ├── goal/goal.schema.ts
│   │       ├── profile/
│   │       │   ├── profile.schema.ts
│   │       │   └── change-password.schema.ts
│   │       ├── settings/settings.schema.ts
│   │       ├── transaction/transaction.schema.ts
│   │       └── index.ts                # Re-exports all schemas
│   │
│   ├── shared/                         # Pure TypeScript - no runtime dependencies
│   │   └── src/
│   │       ├── constants/
│   │       │   ├── application.ts      # APPLICATION_NAME
│   │       │   ├── cookies.ts
│   │       │   ├── currencies.ts
│   │       │   ├── date.ts
│   │       │   ├── i18n.ts
│   │       │   ├── jwt.ts
│   │       │   └── pagination.ts
│   │       ├── enums/
│   │       │   ├── entity.ts
│   │       │   └── transaction.ts
│   │       ├── lib/budget.ts
│   │       ├── types/
│   │       └── validator-rules/
│   │           └── exceptions.ts       # GENERAL_VALIDATION_RULES
│   │
│   ├── hooks/                          # Shared React hooks
│   │   └── src/
│   │       ├── use-month-navigation.ts
│   │       └── index.ts
│   │
│   └── translations/                   # i18n locale files + validation scripts
│       └── src/
│           ├── locales/
│           │   ├── en.json
│           │   └── sr.json             # Serbian locale
│           ├── scripts/
│           │   ├── check-translations.ts
│           │   └── find-missing-translations.ts
│           └── index.ts
│
├── tooling/                            # Shared config packages - no runtime code
│   ├── eslint-config/
│   │   ├── base.js                     # JS + TS + Turbo + Prettier rules
│   │   ├── next.js                     # Extends base + Next.js + React Hooks
│   │   └── react-internal.js           # Extends base + React Hooks (for library packages)
│   ├── prettier-config/                # singleQuote, no semi, sort-imports, tailwindcss plugin
│   ├── tailwind-config/
│   │   └── style.css                   # CSS vars (oklch, full light + dark mode)
│   └── typescript-config/
│       ├── base.json                   # NodeNext strict
│       ├── nextjs.json                 # ESNext + Bundler resolution
│       ├── nestjs.json                 # NestJS-specific config
│       └── react-library.json          # jsx: react-jsx
│
├── .github/
│   └── workflows/
│       └── pre-merge.yml               # CI: type check + lint on PRs
├── .husky/
│   ├── commit-msg                      # Runs commitlint
│   ├── pre-commit                      # Runs lint-staged (ESLint + Prettier on staged files)
│   └── pre-push                        # Blocks push to master, runs tests
├── commitlint.config.cjs               # Conventional Commits enforcement
├── lint-staged.config.cjs              # Staged file linting config
├── turbo.json                          # Pipeline: build, dev, lint, check-types, clean
└── package.json                        # Root workspace (bun@1.3.8, turbo, husky)
```

---

## Apps

| App                  | Stack                                 | Description                                                    |
| -------------------- | ------------------------------------- | -------------------------------------------------------------- |
| `@finiq/api`         | NestJS, TypeORM, PostgreSQL           | REST API with JWT auth, Swagger docs, migrations, and seeders  |
| `@finiq/web`         | Next.js 16, React 19, Tailwind CSS v4 | Web dashboard with transaction management, budgets, and charts |
| `@finiq/mobile`      | Expo (React Native)                   | Mobile client sharing schemas and hooks with the web app       |
| `@finiq/i18n-static` | NestJS                                | Static internationalization assets                             |

## Packages

| Package                    | Description                                |
| -------------------------- | ------------------------------------------ |
| `@finiq/ui`                | Shared React component library (shadcn/ui) |
| `@finiq/hooks`             | Shared React hooks                         |
| `@finiq/schemas`           | Shared Zod validation schemas              |
| `@finiq/shared`            | Shared constants, types, and utilities     |
| `@finiq/translations`      | i18n locale files (en, sr) and scripts     |
| `@finiq/eslint-config`     | Shared ESLint configurations               |
| `@finiq/prettier-config`   | Shared Prettier configuration              |
| `@finiq/tailwind-config`   | Shared Tailwind CSS v4 base styles         |
| `@finiq/typescript-config` | Shared `tsconfig.json` presets             |

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
bun db:seed:dynamic        # Run dynamic seeders
bun db:seed:dynamic:fresh  # Drop and re-seed with dynamic data
bun db:migration:generate  # Generate a new migration
bun db:migration:create    # Create an empty migration file
bun db:migration:revert    # Revert the last migration
```

### API Generation

Regenerate typed API hooks for the web app from the OpenAPI spec:

```sh
bun web:generate:api
```

### Testing

```sh
bun test:web               # Run web unit tests
bun test:web:coverage      # Run with coverage report
bun test:web:watch         # Run in watch mode
bun test:web:e2e           # Run Playwright end-to-end tests
```

### Other Commands

```sh
bun lint            # Lint all packages
bun check-types     # Type-check all packages
bun format          # Format all files with Prettier
bun run clean       # Clean all build artifacts and node_modules
```
