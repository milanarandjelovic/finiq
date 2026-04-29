# @finiq/i18n-static

A lightweight NestJS service that serves language translation JSON files for the Finiq web and mobile apps.

## Endpoints

| Method | Path             | Description                                          |
| ------ | ---------------- | ---------------------------------------------------- |
| `GET`  | `/locales`       | List all available locales                           |
| `GET`  | `/locales/:lang` | Get translations for a language (e.g. `/locales/en`) |
| `GET`  | `/health`        | Health check                                         |
| `GET`  | `/docs`          | API documentation (Redoc)                            |

Locale responses include `Cache-Control: public, max-age=86400`.

## Adding a language

Drop a new JSON file in the `locales/` directory - no code changes needed:

```
locales/
  en.json
  sr.json
  de.json   ← new language
```

## Setup

```bash
cp .env.example .env
bun install
```

## Running

```bash
# development
bun dev --filter=@finiq/i18n-static

# production
bun run build --filter=@finiq/i18n-static
bun run start:prod --filter=@finiq/i18n-static
```

## Environment variables

| Variable                | Default       | Description                     |
| ----------------------- | ------------- | ------------------------------- |
| `PORT`                  | `4001`        | Server port                     |
| `NODE_ENV`              | `development` | Environment                     |
| `CORS_ENABLED`          | `false`       | Enable CORS                     |
| `CORS_ORIGINS`          | -             | Comma-separated allowed origins |
| `THROTTLE_GLOBAL_LIMIT` | `100`         | Max requests per TTL window     |
| `THROTTLE_GLOBAL_TTL`   | `60000`       | TTL window in ms                |
| `DOCS_AUTH_USER`        | `private`     | Redoc basic auth username       |
| `DOCS_AUTH_PASSWORD`    | `folder`      | Redoc basic auth password       |
