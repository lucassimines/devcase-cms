import { computed, type Ref } from 'vue'

import type { LocaleCode, LocalizedString } from '~/types/locale'

type LocalizedModel = string | LocalizedString | Record<string, string>

export function useLocalizedModel(locale: Ref<LocaleCode>) {
  function defineLocalizedModel(model: Ref<LocalizedModel>) {
    return computed({
      get() {
        const value = model.value

        if (typeof value === 'object' && value !== null) {
          return value[locale.value] ?? ''
        }

        return ''
      },
      set(value: string) {
        const current = typeof model.value === 'object' && model.value !== null ? model.value : {}

        model.value = { ...current, [locale.value]: value }
      }
    })
  }

  function normalizeFieldName(name: string, translate: boolean) {
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
