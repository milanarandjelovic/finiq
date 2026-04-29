# `@finiq/web`

The main Next.js 16 web application for Finiq. Provides a full-stack dashboard for managing budgets, categories, goals, transactions, and statistics, with API routes generated via Orval from the backend spec.

## Tech Stack

- [Next.js 16](https://nextjs.org) (App Router) - framework
- [TanStack Query](https://tanstack.com/query) - server state management
- [TanStack Table](https://tanstack.com/table) - data tables
- [Recharts](https://recharts.org) - charts and graphs
- [React Hook Form](https://react-hook-form.com) + Zod - forms and validation
- [Zustand](https://zustand-demo.pmnd.rs) - client state management
- [Orval](https://orval.dev) - API client generation from OpenAPI spec
- [Axios](https://axios-http.com) - HTTP client

## Getting Started

```sh
bun install
bun dev --filter=@finiq/web
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## Scripts

| Command            | Description                             |
| ------------------ | --------------------------------------- |
| `bun dev`          | Start development server on port 3000   |
| `bun build`        | Build for production                    |
| `bun generate:api` | Regenerate API client from OpenAPI spec |
| `bun lint`         | Lint source files                       |
| `bun format`       | Format source files with Prettier       |
