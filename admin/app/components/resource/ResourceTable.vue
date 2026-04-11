<template>
  <div class="flex flex-col gap-4 sm:gap-6 flex-1">
    <div class="flex flex-wrap items-center justify-between gap-1.5">
      <UInput
        v-model="searchTerm"
        class="w-full max-w-72"
        :loading="status === 'pending'"
        icon="lucide:search"
        :placeholder="t('placeholder.search')"
        :ui="{ trailing: 'pe-1' }"
      >
        <template v-if="searchTerm?.length" #trailing>
          <UButton
            color="neutral"
            variant="link"
            size="sm"
            icon="lucide:circle-x"
            aria-label="Clear input"
            @click="clearSearchTerm()"
          />
        </template>
      </UInput>

      <UButton
        v-if="selectedCount"
        :label="t('delete')"
        color="error"
        variant="subtle"
        icon="lucide:trash"
        @click="deleteSelectedRows()"
      >
        <template #trailing>
          <UKbd :value="selectedCount.toString()" />
        </template>
      </UButton>
    </div>

    <div class="flex-1 max-h-full overflow-hidden flex flex-col">
      <UTable
        ref="table"
        v-model:column-visibility="columnVisibility"
        v-model:row-selection="rowSelection"
        :get-row-id="getRowId"
        :pagination="pagination"
        :data="paginatedList?.data ?? []"
        :columns="normalizedColumns"
        :loading="status === 'pending'"
        sticky
        :ui="{
          base: 'table-fixed border-separate border-spacing-0',
          thead: '[&>tr]:bg-elevated/50 [&>tr]:after:content-none',
          tbody: '[&>tr]:last:[&>td]:border-b-0',
          th: 'border-y border-default first:border-l last:border-r',
          td: 'border-b border-default',
          separator: 'h-0'
        }"
      >
        <template #empty>
          <div v-if="status === 'pending'" class="flex flex-col gap-4">
            <USkeleton v-for="i in 6" :key="i" class="w-full h-8" :ui="{ base: 'bg-elevated' }" />
          </div>

          <div v-else v-text="t('table.noData')" />
        </template>

        <template v-for="name in Object.keys($slots)" :key="name" #[name]="slotProps">
          <slot v-if="name === 'actions-cell'" :name="name" v-bind="slotProps" :refresh="refresh" />
          <slot v-else :name="name" v-bind="slotProps" />
        </template>
      </UTable>

      <div
        v-if="paginatedList?.data"
        class="flex items-center justify-between gap-3 border-t border-default pt-4 mt-auto"
      >
        <div
          class="text-sm text-muted"
          v-text="`${selectedCount} of ${paginatedList.meta.total || 0} row(s) selected.`"
        />

        <UPagination
          v-if="paginatedList.meta.last_page > 1"
          :items-per-page="paginationQuery.limit"
          :sibling-count="0"
          :page="paginatedList.meta.page"
          :total="paginatedList.meta.total"
          show-edges
          @update:page="goToPage"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts" generic="T extends { id?: string | number; name?: string; slug?: string }">
import type { TableColumn, TableRow, TableSlots } from '@nuxt/ui'
import type { PaginationQuery } from '~/types/pagination'
import type { PaginatedTableList } from '~/types/table-list'

const props = defineProps<{
  columns: TableColumn<T>[]
  endpoint: string
  filterBy: keyof T | keyof T[]
}>()

defineSlots<
  TableSlots<T> & {
    'header-right': () => VNode
    'actions-cell': (props: { row: TableRow<T>; refresh: () => Promise<void> }) => VNode
  }
>()

const { t } = useI18n()

const route = useRoute()

const searchTerm = ref('')
const searchTermDebounced = refDebounced(searchTerm, 400)

const table = useTemplateRef('table')

const rowSelection = ref<Record<string, boolean>>({})

const selectedCount = computed(() => {
  return Object.values(rowSelection.value).filter(Boolean).length
})

function getRowId(row: T, index: number): string {
  if (row != null && row.id != null) return String(row.id)
  return String(index)
}

const paginationQuery = ref<PaginationQuery>({
  page: 1,
  limit: 10
})

const pagination = ref({
  pageIndex: paginationQuery.value.page - 1,
  pageSize: paginationQuery.value.limit
})

// Single ref for API query: one update (term + page) = one fetch (avoids double fetch when searching from page > 1)
const apiQuery = ref({
  ...paginationQuery.value,
  term: searchTermDebounced.value,
  filterBy: props.filterBy
})

watch(searchTermDebounced, (newTerm) => {
  apiQuery.value = {
    ...apiQuery.value,
    term: newTerm,
    page: 1
  }

  paginationQuery.value.page = 1
})

function clearSearchTerm() {
  searchTerm.value = ''

  paginationQuery.value.page = 1

  apiQuery.value = { ...apiQuery.value, term: '', page: 1 }
}

function goToPage(page: number) {
  table.value?.tableApi?.setPageIndex(page - 1)

  paginationQuery.value.page = page

  apiQuery.value = { ...apiQuery.value, page, term: searchTermDebounced.value }
}

// Fetch paginated data from API
const {
  data: paginatedList,
  status,
  refresh
} = await useAdminApi<PaginatedTableList<T>>(props.endpoint, {
  query: apiQuery
})

const notify = useNotification()

// Automatically get the entity model name from the route
const entityModel = computed(() => {
  // Get the last part of the route name
  return route.name?.toString()?.split('-').pop()
})

// Delete selected rows
async function deleteSelectedRows() {
  try {
    const res = await $adminApi<{ count: number }>(`/${entityModel.value}`, {
      method: 'DELETE',
      body: { ids: Object.keys(rowSelection.value) }
    })

    // Refetch items after deletion
    refresh()

    notify.success({
      description:
        res.count > 1
          ? t('notification.delete.success', { count: res.count }, 2)
          : t('notification.delete.success', 1)
    })

    // Reset row selection
    rowSelection.value = {}
  } catch {
    notify.error()
  }
}

const columnVisibility = ref()

const UCheckbox = resolveComponent('UCheckbox')
const ULink = resolveComponent('ULink')
const UButton = resolveComponent('UButton')

const baseColumns: TableColumn<T>[] = [
  {
    id: 'select',
    meta: {
      class: {
        th: 'w-0'
      }
    },
    header: ({ table }) =>
      h(UCheckbox, {
        modelValue: table.getIsSomePageRowsSelected()
          ? 'indeterminate'
          : table.getIsAllPageRowsSelected(),
        'onUpdate:modelValue': (value: boolean | 'indeterminate') =>
          table.toggleAllPageRowsSelected(!!value),
        ariaLabel: t('select.all')
      }),
    cell: ({ row }) => {
      return h(UCheckbox, {
        modelValue: row.getIsSelected(),
        'onUpdate:modelValue': (value: boolean | 'indeterminate') => row.toggleSelected(!!value),
        ariaLabel: 'Select row'
      })
    }
  }
]

function makeLinkRow(row: TableRow<T>, key: keyof T) {
  return h(
    ULink,
    {
      to: { name: `${route.name?.toString()}-id`, params: { id: row.id } },
      class: 'hover:text-primary'
    },
    () => row.original[key]
  )
}

const normalizedColumns = computed(() => {
  // Merge "name" column from props.columns if it exists
  const nameColumn = props.columns.find((column) => column.id === 'name')
  const slugColumn = props.columns.find((column) => column.id === 'slug')

  if (slugColumn) {
    slugColumn.cell = ({ row }) => makeLinkRow(row, 'slug')
  }

  if (nameColumn) {
    nameColumn.cell = ({ row }) => makeLinkRow(row, 'name')
  }

  return [...baseColumns, ...props.columns]
})
</script>
