<template>
  <UInput v-model="model" :type="showPassword ? 'text' : 'password'" :ui="{ trailing: 'pe-1' }">
    <template #trailing>
      <UButton
        color="neutral"
        variant="link"
        size="sm"
        :icon="showPassword ? 'lucide:eye-off' : 'lucide:eye'"
        :aria-label="showPassword ? $t('hidePassword') : $t('showPassword')"
        :aria-pressed="showPassword"
        aria-controls="password"
        @click="showPassword = !showPassword"
      />
    </template>
  </UInput>
</template>

<script setup lang="ts">
const model = defineModel<string | undefined>({ required: true })

const showPassword = ref(false)
</script>
