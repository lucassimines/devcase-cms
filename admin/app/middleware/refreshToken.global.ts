export default defineNuxtRouteMiddleware(async () => {
  const authStore = useAuthStore()
  const { authUser } = storeToRefs(authStore)

  // Check if a refresh token exists and the user is not authenticated
  if (localStorage.getItem('auth-user-refresh-token') && !authUser.value) {
    try {
      // Refresh the token
      const data = await authStore.refreshToken()

      const { accessToken, refreshToken } = data

      if (accessToken) {
        authStore.setAccessToken(accessToken)
        authStore.setRefreshToken(refreshToken)
      }

      // Fetch the authenticated user with the new token
      await authStore.fetchAuthUser()
    } catch {
      // Clear invalid refresh token and navigate to login
      authStore.setRefreshToken('')
      authStore.setAccessToken('')

      // Redirect to login page
      return navigateTo({ name: 'auth-login' })
    }
  }
})
