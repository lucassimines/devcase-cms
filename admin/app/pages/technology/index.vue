<template>
  <ResourceTablePanel>
    <template #header-right>
      <ResourceFormCreate endpoint="/technology" has-slug :title="$t('entity.technology.create')" />
    </template>

    <ResourceTable :columns="columns" endpoint="/technology" filter-by="name">
      <template #actions-cell="{ row, refresh }">
        <ResourceTableActions
          :to="{ name: 'technology-id', params: { id: row.original.id } }"
          :delete-path="`/technology/${row.original.id}`"
          @deleted="refresh()"
        />
      </template>
    </ResourceTable>
  </ResourceTablePanel>
</template>

<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui'
import type { Technology } from '~/types/technology'

const columns: TableColumn<Technology>[] = [
  {
    id: 'name',
    accessorKey: 'name',
    header: $t('name')
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
