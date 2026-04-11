<template>
  <UDropdownMenu :items="actionItems" :content="{ align: 'end' }">
    <UButton icon="i-lucide-ellipsis-vertical" color="neutral" variant="ghost" class="ml-auto" />
  </UDropdownMenu>
</template>

<script setup lang="ts" generic="T">
import type { DropdownMenuItem } from '@nuxt/ui'
import type { RouteLocationRaw } from 'vue-router'

const props = defineProps<{
  to: RouteLocationRaw
  deletePath: string
}>()

const emit = defineEmits<{
  deleted: []
}>()

const notify = useNotification()

const UDropdownMenu = resolveComponent('UDropdownMenu')

const { t } = useI18n()

const actionItems = computed<DropdownMenuItem[]>(() => {
  return [
    {
      type: 'label',
      label: t('actions')
    },
    {
      type: 'separator'
    },
    {
      label: t('view.details'),
      icon: 'i-lucide-list',
      to: props.to
    },
    {
      type: 'separator'
    },
    {
      label: t('delete'),
      icon: 'i-lucide-trash',
      color: 'error',
      onSelect() {
        deleteItem()
      }
    }
  ]
})

async function deleteItem() {
  try {
    await $adminApi(props.deletePath, {
      method: 'DELETE'
    })

    notify.success({
      description: t('notification.delete.success', 1)
    })

    emit('deleted')
  } catch {
    notify.error()
  }
}
</script>
