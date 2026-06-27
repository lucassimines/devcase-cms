<template>
  <ResourceTablePanel>
    <template #header-right>
      <ResourceFormCreate endpoint="/page" has-slug :title="$t('entity.page.create')" />
    </template>

    <ResourceTable :columns="columns" endpoint="/page" filter-by="name" reorderable show-published>
      <template #actions-cell="{ row, refresh }">
        <ResourceTableActions
          :to="{ name: 'page-id', params: { id: row.original.id } }"
          :delete-path="`/page/${row.original.id}`"
          @deleted="refresh()"
        />
      </template>
    </ResourceTable>
  </ResourceTablePanel>
</template>

<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui'
import type { Page } from '~/types/page'

const columns: TableColumn<Page>[] = [
  {
    id: 'name',
    accessorKey: 'name',
    header: $t('name'),
    meta: {
      localized: true
    }
  },
  {
    id: 'code',
    accessorKey: 'code',
    header: $t('code')
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
