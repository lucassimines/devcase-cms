<template>
  <ResourceTablePanel>
    <template #header-right>
      <ResourceFormCreate
        :endpoint="$entities.category.path"
        has-slug
        :title="$t('entity.category.create')"
      />
    </template>

    <ResourceTable
      :columns="columns"
      :endpoint="$entities.category.path"
      filter-by="name"
      reorderable
    >
      <template #actions-cell="{ row, refresh }">
        <ResourceTableActions
          :to="{ name: 'post-category-id', params: { id: row.original.id } }"
          :delete-path="`${$entities.category.path}/${row.original.id}`"
          @deleted="refresh()"
        />
      </template>
    </ResourceTable>
  </ResourceTablePanel>
</template>

<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui'
import type { Category } from '~/types/category'

const columns: TableColumn<Category>[] = [
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
