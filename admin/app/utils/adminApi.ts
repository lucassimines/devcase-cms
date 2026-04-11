import type { NitroFetchOptions } from 'nitropack'

export function $adminApi<T>(path: string, options: NitroFetchOptions<string> = {}) {
  const authStore = useAuthStore()
  const { accessToken } = storeToRefs(authStore)

  const config = useRuntimeConfig()

  return $fetch<T>(path, {
    baseURL: config.public.adminApiUrl,
    headers: {
      Authorization: `Bearer ${accessToken.value}`
    },
    credentials: 'include',
    ...options,
    async onResponseError({ response }) {
      // If error is 401 (unauthorized), refresh token
      if ((response?._data as { data?: { status?: number } })?.data?.status === 401) {
        const data = await authStore.refreshToken()

        const { accessToken, refreshToken } = data

        if (accessToken) {
          authStore.setAccessToken(accessToken)
          authStore.setRefreshToken(refreshToken)
        }
      }
    }
  })
}
