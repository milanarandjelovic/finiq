import { ReactNode } from 'react'
import type { Metadata } from 'next'
import localFont from 'next/font/local'
import { NuqsAdapter } from 'nuqs/adapters/next/app'

import { APPLICATION_DESCRIPTION, APPLICATION_NAME } from '@finiq/shared'

import '../assets/css/globals.css'

import { Providers } from '@/providers/providers'

const geistSans = localFont({
  src: '../assets/fonts/GeistVF.woff',
  variable: '--font-geist-sans',
})
const geistMono = localFont({
  src: '../assets/fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
})

export const metadata: Metadata = {
  title: {
    default: APPLICATION_NAME,
    template: `%s | ${APPLICATION_NAME}`,
  },
  description: APPLICATION_DESCRIPTION,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-sans`}
        suppressHydrationWarning
      >
        <NuqsAdapter>
          <Providers>{children}</Providers>
        </NuqsAdapter>
      </body>
    </html>
  )
}
