// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxt/eslint',
    '@nuxt/ui',
    '@nuxtjs/i18n',
    '@vueuse/nuxt',
    '@pinia/nuxt',
    '@nuxt/image',
    '@nuxt/icon'
  ],
  ssr: false,

  devtools: {
    enabled: true
  },

  css: ['~/assets/css/main.css'],

  runtimeConfig: {
    authToken: '',
    public: {
      apiUrl: process.env.API_BASE_URL,
      adminApiUrl: `${process.env.API_BASE_URL}/admin`,
      appName: process.env.APP_NAME,
      imagesUrl: process.env.NUXT_PUBLIC_IMAGES_URL
    }
  },

  routeRules: {
    '/api/**': {
      cors: true
    }
  },

  compatibilityDate: '2024-07-11',

  eslint: {
    config: {
      stylistic: {
        commaDangle: 'never',
        braceStyle: '1tbs'
      }
    }
  },

  i18n: {
    strategy: 'no_prefix',
    defaultLocale: 'en-US',
    experimental: {
      typedOptionsAndMessages: 'all'
    },
    locales: [
      {
        code: 'en-US',
        file: 'en-us.json'
      }
    ]
  },

  icon: {
    // With `ssr: false`, the default provider is Iconify's API. Use Nitro's
    // `/api/_nuxt_icon/*` so `@iconify-json/*` collections load locally.
    provider: 'server'
  },

  image: {
    domains: [process.env.NUXT_IMAGES_DOMAIN || ''],
    presets: {
      avatar: {
        modifiers: {
          format: 'webp',
          width: 300
        }
      }
    }
  }
})
