<template>
  <UFormField :label="label" :name="fieldName">
    <NavTranslate v-model="locale" :translate="translate">
      <div :class="cn('relative flex aspect-video flex-col gap-4', ui?.wrapper)">
        <UButton
          icon="lucide:x"
          class="absolute -top-3 -right-3 z-2 flex size-6 items-center justify-center rounded-full"
          color="neutral"
          variant="outline"
          :ui="{ leadingIcon: 'size-3.5' }"
          square
          @click="resetValue()"
        />

        <MediaLibrary v-model="localizedModel">
          <UButton
            class="border-accented group relative size-full overflow-hidden border p-0"
            color="neutral"
            variant="ghost"
            square
          >
            <div
              v-if="localizedModel"
              class="bg-default group-hover:bg-default/50 relative flex size-full items-center justify-center"
            >
              <figure class="size-full overflow-hidden">
                <NuxtImg
                  :src="$file(localizedModel ?? '')"
                  preset="fieldImage"
                  class="size-full object-contain object-center"
                />
              </figure>

              <div
                class="bg-muted/90 text-xxs text-accented absolute bottom-0 left-0 w-full truncate rounded-sm p-1.5"
                v-text="localizedModel"
              />
            </div>

            <div
              v-else
              class="bg-default group-hover:bg-default/50 flex size-full flex-col items-center justify-center gap-2"
            >
              <div
                class="text-muted flex size-10 items-center justify-center rounded-full bg-white/5"
              >
                <Icon name="lucide:image" class="text-xl" />
              </div>

              <span class="text-sm" v-text="t('select.image')" />
            </div>
          </UButton>
        </MediaLibrary>
      </div>
    </NavTranslate>
  </UFormField>
</template>

<script setup lang="ts">
import { DEFAULT_LOCALE, type LocaleCode, type LocalizedString } from '~/types/locale'

interface Props {
  name: string
  label?: string
  translate?: boolean
  ui?: {
    wrapper?: string
  }
}

const props = defineProps<Props>()

const { t } = useI18n()

const model = defineModel<string | LocalizedString>({ required: true })

const locale = ref<LocaleCode>(DEFAULT_LOCALE)

const { defineLocalizedModel, normalizeFieldName } = useLocalizedModel(props.translate, locale)

const localizedModel = defineLocalizedModel(model)

const fieldName = normalizeFieldName(props.name)

function resetValue() {
  if (props.translate && typeof model.value === 'object') {
    model.value = { ...model.value, [locale.value]: '' }
    return
  }

  model.value = ''
}
</script>
