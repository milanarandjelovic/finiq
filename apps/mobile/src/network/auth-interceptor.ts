/**
 * Thin module that holds a module-level logout callback.
 * Keeps network-client.ts and auth-provider.tsx free of circular imports:
 *   auth-provider -> registers via registerLogoutCallback
 *   network-client -> fires via triggerLogout
 */

type LogoutFn = () => Promise<void> | void

let _onLogout: LogoutFn | undefined

export const registerLogoutCallback = (fn: LogoutFn): void => {
  _onLogout = fn
}

export const triggerLogout = async (): Promise<void> => {
  await _onLogout?.()
}
