import { TaskStatus } from '~/types/model/task'

export function useTask() {
  const { t } = useI18n()

  const statusOptions = computed(() => {
    return Object.values(TaskStatus).map((status) => ({
      label: t(`model.task.status.${status.toLowerCase()}`),
      value: status
    }))
  })

  return {
    statusOptions
  }
}
