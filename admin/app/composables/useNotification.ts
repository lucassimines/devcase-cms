import type { ToastProps } from '@nuxt/ui'

export function useNotification() {
  const toast = useToast()

  const { getApiErrorMessage } = useHelpers()

  const { t, te } = useI18n()

  function success(props: ToastProps = {}) {
    toast.add({
      description: t('notification.success.default'),
      color: 'success',
      icon: 'lucide:check-circle',
      ...props
    })
  }

  function error(props: ToastProps = {}) {
    toast.add({
      description: t('notification.error.default'),
      color: 'error',
      icon: 'lucide:alert-circle',
      ...props
    })
  }

  function serverError(err: unknown = {}) {
    const message = getApiErrorMessage(err)
    const description =
      message && te(`server.error.${message}`)
        ? t(`server.error.${message}`)
        : message || t('notification.error.default')

    toast.add({
      description,
      color: 'error',
      icon: 'lucide:alert-circle'
    })
  }

  return {
    success,
    error,
    serverError
  }
}
