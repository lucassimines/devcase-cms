import type { ToastProps } from '@nuxt/ui'

export function useNotification() {
  const toast = useToast()

  const { getApiErrorMessage } = useHelpers()

  const { t } = useI18n()

  function success(props: ToastProps = {}) {
    toast.add({
      description: t('notification.success.default'),
      color: 'success',
      icon: 'i-lucide-check-circle',
      ...props
    })
  }

  function error(props: ToastProps = {}) {
    toast.add({
      description: t('notification.error.default'),
      color: 'error',
      icon: 'i-lucide-alert-circle',
      ...props
    })
  }

  function serverError(err: unknown = {}) {
    toast.add({
      description:
        `${t(`server.error.${getApiErrorMessage(err)}`)}` || t('notification.error.default'),
      color: 'error',
      icon: 'i-lucide-alert-circle'
    })
  }

  return {
    success,
    error,
    serverError
  }
}
