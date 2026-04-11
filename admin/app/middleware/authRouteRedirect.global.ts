export default defineNuxtRouteMiddleware((to) => {
  const isAuthView = to.meta?.layout === 'auth'

  if (isAuthView) return

  if (!localStorage.getItem('auth-user-refresh-token')) {
    return navigateTo({ name: 'auth-login' })
  }
})
