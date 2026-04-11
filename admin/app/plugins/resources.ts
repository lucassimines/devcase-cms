import type { Composer } from 'vue-i18n'
import type { Resources } from '~/types/resources'

export default defineNuxtPlugin({
  name: 'resources',
  async setup(nuxtApp) {
    const i18n = nuxtApp.$i18n as Composer

    const resources = {
      client: {
        model: 'client',
        path: '/client',
        icon: 'i-lucide-briefcase-business',
        label: i18n.t('model.client.name', 2)
      },
      task: {
        model: 'task',
        icon: 'i-lucide-list-checks',
        label: i18n.t('model.task.name', 2),
        path: '/task'
      }
    } satisfies Resources

    return {
      provide: {
        resources
      }
    }
  }
})
