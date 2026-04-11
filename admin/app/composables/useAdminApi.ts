export const useAdminApi = createUseFetch((callerOptions) => ({
  $fetch: useNuxtApp().$adminApi as typeof $fetch,
  lazy: true,
  ...callerOptions
}))
