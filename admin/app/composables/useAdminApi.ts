import type { UseFetchOptions } from 'nuxt/app'

export function useAdminApi<T>(url: string | (() => string), options?: UseFetchOptions<T>) {
  return useFetch(url, {
    lazy: true,
    ...options,
    $fetch: $adminApi as typeof $fetch
    // getCachedData: (key, nuxtApp) => {
    //     return nuxtApp.payload.data[key] ?? nuxtApp.static?.data?.[key];
    // }
  })
}
