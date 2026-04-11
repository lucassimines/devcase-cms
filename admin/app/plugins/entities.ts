import type { Composer } from 'vue-i18n'
import type { Entities } from '~/types/entity'

export default defineNuxtPlugin({
  name: 'resources',
  async setup(nuxtApp) {
    const i18n = nuxtApp.$i18n as Composer

    const entities = {
      project: {
        model: 'project',
        path: '/project',
        icon: 'lucide:terminal',
        label: i18n.t('entity.project.name', 2)
      }
    } satisfies Entities

    return {
      provide: {
        entities
      }
    }
  }
})
