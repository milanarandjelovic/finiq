import { withSentryConfig } from '@sentry/nextjs'

/** @type {import('next').NextConfig} */
const nextConfig = {}

export default withSentryConfig(nextConfig, {
  project: 'finiq-web',
  // org is only needed for CI source map uploads — leave unset locally
  ...(process.env.SENTRY_ORG && { org: process.env.SENTRY_ORG }),
  silent: !process.env.CI,
  widenClientFileUpload: true,
  hideSourceMaps: true,
  disableLogger: true,
})
