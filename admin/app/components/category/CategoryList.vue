<template>
  <ResourceTablePanel>
    <template #header-right>
      <ResourceFormCreate :endpoint="apiPath" has-slug :title="$t('entity.category.create')" />
    </template>

    <ResourceTable :columns="columns" :endpoint="apiPath" filter-by="name" reorderable>
      <template #actions-cell="{ row, refresh }">
        <ResourceTableActions
          :to="{ name: editRouteName, params: { id: row.original.id } }"
          :delete-path="`${apiPath}/${row.original.id}`"
          @deleted="refresh()"
        />
      </template>
    </ResourceTable>
  </ResourceTablePanel>
</template>

<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui'
import type { Category, CategoryType } from '~/types/category'

const props = defineProps<{
  type: CategoryType
  editRouteName: string
}>()

const apiPath = computed(() => `/category/${props.type.toLowerCase()}`)

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
