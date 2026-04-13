// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs'
import vueI18n from '@intlify/eslint-plugin-vue-i18n'
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended'

export default withNuxt([
  ...vueI18n.configs['flat/recommended'],
  eslintPluginPrettierRecommended,
  {
    settings: {
      'vue-i18n': {
        localeDir: './i18n/locales/*.json',
        messageSyntaxVersion: '^9.0.0'
      }
    },
    rules: {
      '@intlify/vue-i18n/no-missing-keys': 'error',
      '@intlify/vue-i18n/no-raw-text': 'off',
      semi: ['error', 'never'],
      'vue/no-multiple-template-root': 'off',
      'vue/component-name-in-template-casing': [
        'error',
        'PascalCase',
        {
          registeredComponentsOnly: false
        }
      ],
      'vue/multi-word-component-names': 'off',
      'vue/max-attributes-per-line': [
        'error',
        {
          singleline: 6
        }
      ],
      'vue/no-unused-properties': [
        'error',
        {
          groups: ['props'],
          deepData: false,
          ignorePublicMembers: false
        }
      ]
    }
  }
])
