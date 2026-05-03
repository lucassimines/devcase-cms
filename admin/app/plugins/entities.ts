import type { Composer } from 'vue-i18n'
import type { Entities } from '~/types/entity'

export default defineNuxtPlugin({
  name: 'resources',
  async setup(nuxtApp) {
    const i18n = nuxtApp.$i18n as Composer

    const entities = {
      page: {
        model: 'page',
        path: '/page',
        icon: 'lucide:file-text',
        label: i18n.t('entity.page.name', 2)
      },
      project: {
        model: 'project',
        path: '/project',
        icon: 'lucide:layers',
        label: i18n.t('entity.project.name', 2)
      },
      technology: {
        model: 'technology',
        path: '/technology',
        icon: 'lucide:code',
        label: i18n.t('entity.technology.name', 2)
      },
      solution: {
        model: 'solution',
        path: '/solution',
        icon: 'lucide:puzzle',
        label: i18n.t('entity.solution.name', 2)
      }
      // settings: {
      //   model: 'settings',
      //   path: '/settings',
      //   icon: 'lucide:settings',
      //   label: i18n.t('entity.settings.name')
      // }
    } satisfies Entities

    return {
      provide: {
        entities
      }
    }
  }
})
