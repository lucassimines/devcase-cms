<template>
  <div class="relative flex flex-col gap-4 size-56">
    <UButton
      icon="i-lucide-x"
      class="absolute -top-3 -right-3 rounded-full z-2 size-6 flex items-center justify-center"
      color="neutral"
      variant="outline"
      :ui="{ leadingIcon: 'size-3.5' }"
      square
      @click="model = ''"
    />

    <MediaLibrary v-model="model">
      <UButton
        class="size-full relative overflow-hidden border border-accented"
        color="neutral"
        variant="ghost"
        square
      >
        <div v-if="model" class="size-full flex items-center justify-center relative">
          <figure class="rounded-sm overflow-hidden">
            <NuxtImg :src="$file(model ?? '')" class="max-w-full h-full object-contain" />
          </figure>

          <div
            class="absolute bottom-0 rounded-sm left-0 w-full p-1.5 bg-muted/90 text-xxs text-accented truncate"
            v-text="model"
          />
        </div>

        <div v-else class="size-full flex flex-col items-center justify-center gap-2">
          <IconRounded icon="i-lucide-image" size="lg" color="neutral" variant="subtle" square />

          <p class="text-sm" v-text="t('select.image')" />
        </div>
      </UButton>
    </MediaLibrary>
  </div>
</template>

<script setup lang="ts">
const { t } = useI18n()

const model = defineModel<string | null | undefined>({ required: true })
</script>
