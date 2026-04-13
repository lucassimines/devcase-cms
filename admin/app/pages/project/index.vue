<template>
  <ResourceTablePanel>
    <template #header-right>
      <ResourceFormCreate endpoint="/project" has-slug :title="$t('entity.project.create')" />
    </template>

    <ResourceTable :columns="columns" endpoint="/project" filter-by="name">
      <template #actions-cell="{ row, refresh }">
        <ResourceTableActions
          :to="{ name: 'project-id', params: { id: row.original.id } }"
          :delete-path="`/project/${row.original.id}`"
          @deleted="refresh()"
        />
      </template>
    </ResourceTable>
  </ResourceTablePanel>
</template>

<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui'
import type { Project } from '~/types/project'

const columns: TableColumn<Project>[] = [
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
