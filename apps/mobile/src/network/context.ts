import axios from 'axios'
import * as Application from 'expo-application'
import * as Device from 'expo-device'
import { Dimensions, Platform } from 'react-native'

import { Env } from '@/util/env'

export type FiniqContext = {
  platform: string
  osVersion: string
  deviceModel: string
  deviceMake: string
  deviceWidth: number
  bundleIdentifier: string
}

export const createUserAgent = (): string => {
  return `${Device.brand} ${Device.modelName} ${Device.osName}/${Device.osVersion} finiq/${Application.nativeApplicationVersion} axios/${axios.VERSION}`
}

export const createLibraryUserAgent = (): string => {
  const library = Platform.OS === 'ios' ? 'AppleCoreMedia' : 'AndroidXMedia3'
  const version = Platform.OS === 'ios' ? '1.0.0' : '1.0.0'
  return `${Env.appId}/${Application.nativeApplicationVersion} (${Device.brand}; ${Device.modelName} ${Device.osName} ${Device.osVersion}) ${library}/${version}`
}

export const createFiniqContext = (): FiniqContext => {
  const { width } = Dimensions.get('window')

  return {
    platform: Device.osName ?? Platform.OS,
    osVersion: Device.osVersion ?? 'unknown',
    deviceModel: Device.modelName ?? 'unknown',
    deviceMake: Device.brand ?? 'unknown',
    deviceWidth: width,
    bundleIdentifier: Application.applicationId ?? '',
  }
}
