<template>
  <UInput v-if="!translate && typeof model === 'string'" v-model="model" />

  <NavTranslate v-else v-slot="{ locale }">
    <UInput
      :model-value="getLocalizedValue(locale)"
      @update:model-value="setLocalizedValue(locale, $event)"
    />
  </NavTranslate>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    translate?: boolean
  }>(),
  {
    translate: false
  }
)

const model = defineModel<string | Record<string, string>>({ required: true })

function getLocalizedValue(code: string) {
  const value = model.value

  return typeof value === 'object' && value !== null ? (value[code] ?? '') : ''
}

function setLocalizedValue(code: string, value: string) {
  const current = typeof model.value === 'object' && model.value !== null ? model.value : {}

  model.value = { ...current, [code]: value }
}
</script>
