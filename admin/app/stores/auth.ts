export const useAuthStore = defineStore('auth', () => {
  const config = useRuntimeConfig()

  const authUser = ref<AuthUser | null>(null)

  function setAuthUser(incomingUser: AuthUser) {
    authUser.value = incomingUser
  }

  const accessToken = ref('')

  function setAccessToken(token: string) {
    accessToken.value = token
  }

  function setRefreshToken(token: string) {
    localStorage.setItem('auth-user-refresh-token', token)
  }

  async function refreshToken() {
    return await $fetch<{ accessToken: string; refreshToken: string }>(
      `${config.public?.apiUrl}/auth/refresh-token`,
      {
        method: 'POST',
        body: {
          refreshToken: localStorage.getItem('auth-user-refresh-token')
        }
      }
    )
  }

  async function fetchAuthUser() {
    const data = await $fetch<AuthUser>(`${config.public?.apiUrl}/auth/user`, {
      params: {
        token: localStorage.getItem('auth-user-refresh-token')
      }
    })

    setAuthUser(data)
  }

  function logout() {
    authUser.value = null
    accessToken.value = ''

    navigateTo({ name: 'auth-login' })
  }

  return {
    authUser,
    setAuthUser,
    accessToken,
    setAccessToken,
    setRefreshToken,
    refreshToken,
    fetchAuthUser,
    logout
  }
})
