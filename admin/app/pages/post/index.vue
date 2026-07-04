<template>
  <ResourceTablePanel>
    <template #header-right>
      <PanelHeaderActions :actions="actions" />
    </template>

    <ResourceTable :columns="columns" endpoint="/post" filter-by="name" show-published>
      <template #actions-cell="{ row, refresh }">
        <ResourceTableActions
          :to="{ name: 'post-id', params: { id: row.original.id } }"
          :delete-path="`/post/${row.original.id}`"
          @deleted="refresh()"
        />
      </template>
    </ResourceTable>
  </ResourceTablePanel>

  <PostFormGenerate v-model:open="generateOpen" />

  <ResourceFormCreate
    v-model:open="createOpen"
    hide-trigger
    endpoint="/post"
    has-slug
    :title="$t('entity.post.create')"
  />
</template>

<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui'
import type { PanelHeaderAction } from '~/types/panel-header-action'
import type { Post } from '~/types/post'

const { $entities } = useNuxtApp()

const generateOpen = ref(false)
const createOpen = ref(false)

const actions = computed<PanelHeaderAction[]>(() => [
  {
    label: $t('entity.category.name', 2),
    icon: $entities.category.icon,
    to: '/post/category',
    variant: 'soft',
    color: 'neutral'
  },
  {
    label: $t('entity.post.generate'),
    icon: 'lucide:sparkles',
    color: 'primary',
    variant: 'soft',
    onSelect: () => {
      generateOpen.value = true
    }
  },
  {
    label: $t('entity.post.create'),
    icon: 'lucide:plus',
    variant: 'soft',
    onSelect: () => {
      createOpen.value = true
    }
  }
])

const columns: TableColumn<Post>[] = [
  {
    id: 'image',
    accessorKey: 'image',
    header: $t('image'),
    meta: {
      image: true,
      localized: true
    }
  },
  {
    id: 'name',
    accessorKey: 'name',
    header: $t('name'),
    meta: {
      localized: true
    }
  },
  {
    id: 'slug',
    accessorKey: 'slug',
    header: $t('slug')
  },
  {
    id: 'actions'
  }
]
</script>
