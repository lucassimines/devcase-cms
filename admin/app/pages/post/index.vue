<template>
  <ResourceTablePanel>
    <template #header-right>
      <ButtonModel entity="category" path="/post/category" />

      <ResourceFormCreate endpoint="/post" has-slug :title="$t('entity.post.create')" />
    </template>

    <ResourceTable :columns="columns" endpoint="/post" filter-by="name" reorderable show-published>
      <template #actions-cell="{ row, refresh }">
        <ResourceTableActions
          :to="{ name: 'post-id', params: { id: row.original.id } }"
          :delete-path="`/post/${row.original.id}`"
          @deleted="refresh()"
        />
      </template>
    </ResourceTable>
  </ResourceTablePanel>
</template>

<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui'
import type { Post } from '~/types/post'

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
    id: 'sortOrder',
    accessorKey: 'order',
    header: $t('order'),
    meta: {
      class: {
        th: 'w-20',
        td: 'w-20 tabular-nums'
      }
    }
  },
  {
    id: 'actions'
  }
]
</script>
