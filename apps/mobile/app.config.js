module.exports = ({ config }) => ({
  ...config,
  extra: {
    ...config.extra,
    sentryEnableLogs: process.env.SENTRY_ENABLE_LOGS === 'true',
    sentryProfileLifecycle: process.env.SENTRY_PROFILE_LIFECYCLE ?? 'trace',
    sentrySendDefaultPii: process.env.SENTRY_SEND_DEFAULT_PII === 'true',
  },
})
