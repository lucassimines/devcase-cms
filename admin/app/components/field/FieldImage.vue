<template>
  <div class="relative flex aspect-video flex-col gap-4">
    <UButton
      icon="lucide:x"
      class="absolute -top-3 -right-3 z-2 flex size-6 items-center justify-center rounded-full"
      color="neutral"
      variant="outline"
      :ui="{ leadingIcon: 'size-3.5' }"
      square
      @click="model = ''"
    />

    <MediaLibrary v-model="model">
      <UButton
        class="border-accented group relative size-full overflow-hidden border p-0"
        color="neutral"
        variant="ghost"
        square
      >
        <div
          v-if="model"
          class="bg-default group-hover:bg-default/50 relative flex size-full items-center justify-center"
        >
          <figure class="size-full overflow-hidden">
            <NuxtImg
              :src="$file(model ?? '')"
              preset="fieldImage"
              class="size-full object-contain object-center"
            />
          </figure>

          <div
            class="bg-muted/90 text-xxs text-accented absolute bottom-0 left-0 w-full truncate rounded-sm p-1.5"
            v-text="model"
          />
        </div>

        <div
          v-else
          class="bg-default group-hover:bg-default/50 flex size-full flex-col items-center justify-center gap-2"
        >
          <div class="text-muted flex size-10 items-center justify-center rounded-full bg-white/5">
            <Icon name="lucide:image" class="text-xl" />
          </div>

          <span class="text-sm" v-text="t('select.image')" />
        </div>
      </UButton>
    </MediaLibrary>
  </div>
</template>

<script setup lang="ts">
const { t } = useI18n()

const model = defineModel<string | null | undefined>({ required: true })
</script>
