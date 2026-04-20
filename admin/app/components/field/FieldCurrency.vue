<template>
  <UInput
    v-model.number="model"
    :value="model || undefined"
    type="number"
    placeholder="0.00"
    :step="0.01"
    :min="0"
  >
    <template #leading>
      <p class="text-sm text-muted" v-text="$t('currency')" />
    </template>
  </UInput>
</template>

<script setup lang="ts">
const model = defineModel<number | string>({ required: true })
</script>
