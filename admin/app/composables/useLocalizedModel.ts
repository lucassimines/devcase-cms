import { computed, type Ref } from 'vue'

import type { LocaleCode, LocalizedString } from '~/types/locale'

type LocalizedModel = string | LocalizedString | Record<string, string>

export function useLocalizedModel(translate: boolean | undefined, locale: Ref<LocaleCode>) {
  function defineLocalizedModel(model: Ref<LocalizedModel>) {
    return computed<string>({
      get() {
        const value = model.value

        if (!translate) {
          return typeof value === 'string' ? value : ''
        }

        if (typeof value === 'object' && value !== null) {
          return value[locale.value] ?? ''
        }

        return ''
      },
      set(value: string) {
        if (!translate) {
          model.value = value
          return
        }

        const current = typeof model.value === 'object' && model.value !== null ? model.value : {}

        model.value = { ...current, [locale.value]: value }
      }
    })
  }

  function normalizeFieldName(name: string) {
    if (translate) {
      return `${name}.${locale.value}`
    }

    return name
  }

  return {
    defineLocalizedModel,
    normalizeFieldName
  }
}
