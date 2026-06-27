import { beforeEach, describe, expect, it } from 'vitest'
import { ref, type Ref } from 'vue'

import { useLocalizedModel } from '~/composables/useLocalizedModel'
import { DEFAULT_LOCALE, type LocaleCode, type LocalizedString } from '~/types/locale'

const makeLocalized = (en = '', pt = ''): LocalizedString => ({
  'en-US': en,
  'pt-BR': pt
})

describe('useLocalizedModel', () => {
  let locale: Ref<LocaleCode>
  let nonTranslated: ReturnType<typeof useLocalizedModel>
  let translated: ReturnType<typeof useLocalizedModel>

  beforeEach(() => {
    locale = ref<LocaleCode>(DEFAULT_LOCALE)
    nonTranslated = useLocalizedModel(false, locale)
    translated = useLocalizedModel(true, locale)
  })

  describe('non-translated fields', () => {
    it('reads a plain string value', () => {
      const model = ref('Home')
      const localizedModel = nonTranslated.defineLocalizedModel(model)

      expect(localizedModel.value).toBe('Home')
    })

    it('returns an empty string when the model is a localized object', () => {
      const model = ref(makeLocalized('Home', 'Início'))
      const localizedModel = nonTranslated.defineLocalizedModel(model)

      expect(localizedModel.value).toBe('')
    })

    it('writes a plain string value', () => {
      const model = ref('Home')
      const localizedModel = nonTranslated.defineLocalizedModel(model)

      localizedModel.value = 'About'

      expect(model.value).toBe('About')
    })

    it('keeps the original field name for validation paths', () => {
      expect(nonTranslated.normalizeFieldName('slug')).toBe('slug')
    })
  })

  describe('translated fields', () => {
    it('reads the value for the active locale', () => {
      const model = ref(makeLocalized('Home', 'Início'))
      const localizedModel = translated.defineLocalizedModel(model)

      expect(localizedModel.value).toBe('Home')

      locale.value = 'pt-BR'

      expect(localizedModel.value).toBe('Início')
    })

    it('returns an empty string when the active locale is missing', () => {
      const model = ref({ 'en-US': 'Home' } as LocalizedString)
      const localizedModel = translated.defineLocalizedModel(model)

      locale.value = 'pt-BR'

      expect(localizedModel.value).toBe('')
    })

    it('returns an empty string when the model is a plain string', () => {
      const model = ref('Home')
      const localizedModel = translated.defineLocalizedModel(model)

      expect(localizedModel.value).toBe('')
    })

    it('merges updates into the localized object without dropping other locales', () => {
      const model = ref(makeLocalized('Home', 'Início'))
      const localizedModel = translated.defineLocalizedModel(model)

      localizedModel.value = 'About'

      expect(model.value).toEqual({
        'en-US': 'About',
        'pt-BR': 'Início'
      })
    })

    it('creates a localized object when updating from an empty model', () => {
      const model = ref('')
      const localizedModel = translated.defineLocalizedModel(model)

      localizedModel.value = 'Home'

      expect(model.value).toEqual({ 'en-US': 'Home' })
    })

    it('updates only the active locale when switching tabs', () => {
      const model = ref(makeLocalized('Home', ''))
      const localizedModel = translated.defineLocalizedModel(model)

      locale.value = 'pt-BR'
      localizedModel.value = 'Início'

      expect(model.value).toEqual({
        'en-US': 'Home',
        'pt-BR': 'Início'
      })
    })

    it('suffixes the field name with the active locale for validation paths', () => {
      expect(translated.normalizeFieldName('name')).toBe('name.en-US')

      locale.value = 'pt-BR'

      expect(translated.normalizeFieldName('name')).toBe('name.pt-BR')
    })
  })
})
