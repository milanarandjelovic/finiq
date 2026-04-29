# `@finiq/mobile`

The Finiq mobile app built with Expo and React Native. Covers budgets, categories, goals, transactions, statistics, and settings, with full i18n support and file-based routing via Expo Router.

## Tech Stack

- [Expo 54](https://expo.dev) + [React Native 0.81](https://reactnative.dev) - framework
- [Expo Router 6](https://expo.github.io/router) - file-based navigation
- [TanStack Query](https://tanstack.com/query) - server state management
- [React Hook Form](https://react-hook-form.com) + Zod - forms and validation
- [i18next](https://www.i18next.com) + `react-i18next` - internationalisation
- [Axios](https://axios-http.com) - HTTP client
- [React Native Reanimated](https://docs.swmansion.com/react-native-reanimated) - animations

## Getting Started

```sh
bun install
bun dev --filter=@finiq/mobile
```

## Scripts

| Command           | Description               |
| ----------------- | ------------------------- |
| `bun dev`         | Start Expo dev server     |
| `bun android`     | Open on Android emulator  |
| `bun ios`         | Open on iOS simulator     |
| `bun lint`        | Lint source files         |
| `bun check-types` | Run TypeScript type check |
