<template>
  <div class="space-y-2">
    <slot />

    <nav v-if="translate && locales.length > 1" class="flex flex-wrap gap-1">
      <UButton
        v-for="locale in locales"
        :key="locale.code"
        :label="locale.abbr"
        size="xs"
        :ui="{ label: 'uppercase' }"
        :color="activeLocale === locale.code ? 'primary' : 'neutral'"
        :variant="activeLocale === locale.code ? 'subtle' : 'ghost'"
        @click="setLocale(locale.code)"
      />
    </nav>
  </div>
</template>

<script setup lang="ts">
import { DEFAULT_LOCALE, type LocaleCode } from '~/types/locale'

const { locales } = useAppConfig()

defineProps<{
  translate?: boolean
}>()

const activeLocale = defineModel<LocaleCode>({
  default: () => DEFAULT_LOCALE
})

function setLocale(locale: LocaleCode) {
  activeLocale.value = locale
}
</script>
