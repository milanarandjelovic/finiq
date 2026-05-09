import { Redirect } from 'expo-router'
import { ActivityIndicator, View } from 'react-native'

import { useAuth } from '@/providers/auth-provider'
import { ROUTES } from '@/util/routes'

export default function Index() {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator />
      </View>
    )
  }

  return <Redirect href={isAuthenticated ? ROUTES.DASHBOARD : ROUTES.LOGIN} />
}
