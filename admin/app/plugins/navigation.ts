import type { Resources } from '~/types/resources'

export default defineNuxtPlugin({
  dependsOn: ['resources'],
  async setup(nuxtApp) {
    const resources = nuxtApp.$resources as Resources

    const navigation = {
      main: [
        {
          label: 'Home',
          icon: 'i-lucide-house',
          to: '/'
        },
        {
          label: resources.client.label,
          icon: 'i-lucide-briefcase-business',
          to: '/client'
        },
        {
          label: 'Settings',
          to: '/settings',
          icon: 'i-lucide-settings',
          defaultOpen: true,
          type: 'trigger',
          children: [
            {
              label: 'General',
              to: '/settings',
              exact: true
            },
            {
              label: 'Members',
              to: '/settings/members'
            },
            {
              label: 'Notifications',
              to: '/settings/notifications'
            },
            {
              label: 'Security',
              to: '/settings/security'
            }
          ]
        }
      ],
      footer: [
        {
          label: 'Feedback',
          icon: 'i-lucide-message-circle',
          to: 'https://github.com/nuxt-ui-templates/dashboard',
          target: '_blank'
        },
        {
          label: 'Help & Support',
          icon: 'i-lucide-info',
          to: 'https://github.com/nuxt-ui-templates/dashboard',
          target: '_blank'
        }
      ]
    }

    return {
      provide: {
        navigation
      }
    }
  }
})
