<template>
  <ResourceTablePanel>
    <template #header-right>
      <ResourceFormCreate endpoint="/solution" :title="$t('entity.solution.create')" />
    </template>

    <ResourceTable :columns="columns" endpoint="/solution" filter-by="name" reorderable>
      <template #actions-cell="{ row, refresh }">
        <ResourceTableActions
          :to="{ name: 'solution-id', params: { id: row.original.id } }"
          :delete-path="`/solution/${row.original.id}`"
          @deleted="refresh()"
        />
      </template>
    </ResourceTable>
  </ResourceTablePanel>
</template>

<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui'
import type { Solution } from '~/types/solution'

const columns: TableColumn<Solution>[] = [
  {
    id: 'name',
    accessorKey: 'name',
    header: $t('name')
  },
  {
    id: 'actions'
  }
]
</script>
