<template>
  <UFormField
    :label="$t('imageStyle')"
    name="imageStyle"
    :ui="{ container: 'flex max-sm:flex-col items-start sm:items-center gap-4' }"
  >
    <USelectMenu
      v-model="imageStyle"
      :items="imageStyles"
      value-key="value"
      :placeholder="$t('select.label')"
    />

    <UButton
      :label="$t('entity.post.generateImage')"
      icon="lucide:sparkles"
      color="primary"
      variant="subtle"
      size="sm"
      loading-auto
      @click="generate()"
    />
  </UFormField>
</template>

<script setup lang="ts">
import type { LocalizedString } from '~/types/locale'

const props = defineProps<{
  postId: string
}>()

const imageStyles = [
  {
    label: '2d Pixel Art',
    value: '2d-pixel-art'
  },
  {
    label: 'Isometric Technology',
    value: 'isometric-technology'
  }
]

const imageStyle = ref<string>(imageStyles[0]?.value ?? '')

const image = defineModel<string | LocalizedString>({ required: true })

const notify = useNotification()

const confirm = useConfirmDialog()

const { t } = useI18n()

const { $tr } = useNuxtApp()

async function generate() {
  if ($tr(image.value)) {
    const confirmed = await confirm({
      title: t('entity.post.generateImageConfirm')
    })

    if (!confirmed) return
  }

  try {
    const res = await $adminApi<{ image: LocalizedString }>(
      `/post/${props.postId}/generate-image`,
      {
        method: 'POST',
        timeout: 3 * 60 * 1000,
        body: {
          style: imageStyle.value
        }
      }
    )

    if (res?.image) {
      image.value = res.image
      notify.success()
      return
    }

    notify.error()
  } catch (err: unknown) {
    notify.serverError(err)
  }
}
</script>
