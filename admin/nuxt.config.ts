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
      imagesUrl: process.env.NUXT_PUBLIC_IMAGES_URL,
      frontendUrl: process.env.FRONTEND_URL
    }
  },

  routeRules: {
    '/api/**': {
      cors: true
    },
    '/': {
      redirect: { to: '/page' }
    }
  },

  compatibilityDate: '2024-07-11',

  vite: {
    optimizeDeps: {
      include: [
        '@nuxt/ui > prosemirror-state',
        '@nuxt/ui > prosemirror-transform',
        '@nuxt/ui > prosemirror-model',
        '@nuxt/ui > prosemirror-view',
        '@nuxt/ui > prosemirror-gapcursor',
        '@vue/devtools-core',
        '@vue/devtools-kit',
        'zod',
        'vuedraggable'
      ]
    }
  },

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
    provider: 'server',
    // Pre-register icons in the client bundle so route changes do not wait on
    // per-icon HTTP requests. Literal names in Vue/TS are picked up by scan;
    // dynamic names still use the server endpoint (add them to `icons` if needed).
    clientBundle: {
      scan: true
    }
  },

  image: {
    provider: process.env.VERCEL ? 'vercel' : 'ipx',
    domains:
      process.env.NUXT_IMAGES_DOMAIN?.split(',')
        .map((domain) => domain.trim())
        .filter(Boolean) ?? [],
    presets: {
      fieldImage: {
        modifiers: {
          format: 'webp',
          quality: 80,
          width: 1280,
          fit: 'inside'
        }
      },
      avatar: {
        modifiers: {
          format: 'webp',
          quality: 80,
          width: 300
        }
      },
      mediaLibraryThumb: {
        modifiers: {
          format: 'webp',
          quality: 80,
          width: 240,
          height: 240,
          fit: 'inside'
        }
      }
    }
  }
})
