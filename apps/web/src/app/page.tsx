import { redirect } from 'next/navigation'

import { ROUTES } from '@/util/routes'

export default function RootPage() {
  redirect(ROUTES.DASHBOARD)
}
