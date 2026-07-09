<template>
  <UButton
    :label="$t('entity.post.generateImage')"
    icon="lucide:sparkles"
    color="primary"
    variant="subtle"
    size="sm"
    :loading="loading"
    @click="generate()"
  />
</template>

<script setup lang="ts">
import type { LocalizedString } from '~/types/locale'

const props = defineProps<{
  postId: string
}>()

const image = defineModel<string | LocalizedString>({ required: true })

const { t } = useI18n()
const notify = useNotification()

const loading = ref(false)

function hasExistingImage(value: string | LocalizedString) {
  if (typeof value === 'string') {
    return Boolean(value.trim())
  }

  return Boolean(value['en-US']?.trim() || value['pt-BR']?.trim())
}

async function generate() {
  if (hasExistingImage(image.value)) {
    const confirmed = window.confirm(t('entity.post.generateImageConfirm'))

    if (!confirmed) return
  }

  loading.value = true

  try {
    const res = await $adminApi<{ image: LocalizedString }>(`/post/${props.postId}/generate-image`, {
      method: 'POST',
      timeout: 3 * 60 * 1000
    })

    if (res?.image) {
      image.value = res.image
      notify.success()
      return
    }

    notify.error()
  } catch (err: unknown) {
    notify.serverError(err)
  } finally {
    loading.value = false
  }
}
</script>
