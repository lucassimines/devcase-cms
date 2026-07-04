<template>
  <UModal v-model:open="open" :title="$t('entity.post.generate')">
    <template #body>
      <UForm :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">
        <UFormField :label="$t('entity.post.topic')" name="topic">
          <UTextarea v-model="state.topic" :rows="4" autoresize />
        </UFormField>

        <div class="flex justify-end gap-2">
          <UButton
            :label="$t('button.cancel')"
            color="neutral"
            variant="subtle"
            size="lg"
            @click="close()"
          />
          <UButton
            :label="$t('entity.post.generate')"
            icon="lucide:sparkles"
            color="primary"
            variant="subtle"
            size="lg"
            type="submit"
            loading-auto
          />
        </div>
      </UForm>
    </template>
  </UModal>
</template>

<script setup lang="ts">
import type { FormSubmitEvent } from '@nuxt/ui'
import * as z from 'zod'

const schema = z.object({
  topic: z.string().trim().min(1)
})

type Schema = z.output<typeof schema>

const state = reactive<Schema>({
  topic: ''
})

const open = defineModel<boolean>('open', { default: false })

const notify = useNotification()

const route = useRoute()

function close() {
  open.value = false
}

watch(open, (isOpen) => {
  if (!isOpen) {
    state.topic = ''
  }
})

async function onSubmit(event: FormSubmitEvent<Schema>) {
  try {
    const res = await $adminApi<{ id: string }>('/post/generate', {
      method: 'POST',
      timeout: 15 * 60 * 1000,
      body: {
        topic: event.data.topic
      }
    })

    if (res?.id) {
      notify.success()
      open.value = false
      navigateTo(`${route.path}/${res.id}`)
      return
    }

    notify.error()
  } catch (err: unknown) {
    notify.serverError(err)
  }
}
</script>
