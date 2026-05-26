import {
  ACCESS_TOKEN_COOKIE_NAME,
  REFRESH_TOKEN_COOKIE_NAME,
} from '@finiq/shared'

/**
 * Get cookie value by name.
 *
 * @param {string} name - The name of the cookie to retrieve.
 * @returns {string | null} - The value of the cookie, or null if not found.
 */
export function getCookieValue(name: string): string | null {
  if (typeof document === 'undefined') {
    return null
  }

  const match = document.cookie.match(new RegExp(`(?:^|;\\s*)${name}=([^;]*)`))

  return match ? decodeURIComponent(match[1] ?? '') : null
}

/**
 * Get the access token from the cookie.
 *
 * @returns {string | null} The access token, or null if not found.
 */
export function getAccessToken(): string | null {
  return getCookieValue(ACCESS_TOKEN_COOKIE_NAME)
}

/**
 * Set the access token in the cookie.
 *
 * @param {string} token - The access token to set.
 * @returns {void}
 */
export function setAccessToken(token: string): void {
  document.cookie = `${ACCESS_TOKEN_COOKIE_NAME}=${encodeURIComponent(token)}; path=/; SameSite=Lax`
}

/**
 * Clear the access token from the cookie.
 *
 * @returns {void}
 */
export function clearAccessToken(): void {
  document.cookie = `${ACCESS_TOKEN_COOKIE_NAME}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`
}

/**
 * Get the refresh token from the cookie.
 *
 * @returns {string | null} The refresh token, or null if not found.
 */
export function getRefreshToken(): string | null {
  return getCookieValue(REFRESH_TOKEN_COOKIE_NAME)
}

/**
 * Set the refresh token in the cookie.
 *
 * @param {string} token - The refresh token to set.
 * @returns {void}
 */
export function setRefreshToken(token: string): void {
  document.cookie = `${REFRESH_TOKEN_COOKIE_NAME}=${encodeURIComponent(token)}; path=/; SameSite=Lax`
}

/**
 * Clear the refresh token from the cookie.
 *
 * @returns {void}
 */
export function clearRefreshToken(): void {
  document.cookie = `${REFRESH_TOKEN_COOKIE_NAME}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`
}
