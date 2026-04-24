<template>
  <div class="flex flex-col gap-4 sm:gap-6 flex-1">
    <div class="flex flex-wrap items-center justify-between gap-1.5">
      <UInput
        :key="status"
        v-model="searchTerm"
        class="w-full max-w-72"
        icon="lucide:search"
        :loading="status === 'pending'"
        :placeholder="$t('placeholder.search')"
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
        :label="$t('button.delete')"
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
        :data="draggedItems ?? []"
        :columns="normalizedColumns"
        :loading="status === 'pending'"
        sticky
        :ui="{
          base: 'table-fixed border-separate border-spacing-0',
          thead: '[&>tr]:bg-elevated/50 [&>tr]:after:content-none',
          tbody: 'table-tbody [&>tr]:last:[&>td]:border-b-0',
          th: 'border-y border-default first:border-l last:border-r',
          td: 'border-b border-default',
          separator: 'h-0'
        }"
      >
        <template #empty>
          <div v-text="$t('table.noData')" />
        </template>

        <template v-for="name in Object.keys($slots)" :key="name" #[name]="slotProps">
          <div class="flex justify-end">
            <slot
              v-if="name === 'actions-cell'"
              :name="name"
              v-bind="slotProps"
              :refresh="refresh"
            />

            <slot v-else :name="name" v-bind="slotProps" />
          </div>
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
import { useSortable } from '@vueuse/integrations/useSortable'
import type { PaginationQuery } from '~/types/pagination'
import type { PaginatedTableList, TableListItem } from '~/types/table-list'

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
  // Skip to prevent double fetch when clearing search
  if (!newTerm) return

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
          ? $t('notification.delete.success', { count: res.count }, 2)
          : $t('notification.delete.success', 1)
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
const Icon = resolveComponent('Icon')

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
        ariaLabel: $t('select.all')
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

const orderColumn = computed<TableColumn<T> | undefined>(() => {
  if (!itemIsReorderable.value) return

  return {
    id: 'order',
    meta: {
      class: {
        th: 'w-0',
        td: 'w-0'
      }
    },
    cell: () => {
      return h(Icon, {
        name: 'lucide:arrow-up-down',
        class: 'cursor-grab active:cursor-grabbing text-base hover:text-primary'
      })
    }
  }
})

const normalizedColumns = computed<TableColumn<T>[]>(() => {
  // Merge "name" column from props.columns if it exists
  const nameColumn = props.columns.find((column) => column.id === 'name')
  const slugColumn = props.columns.find((column) => column.id === 'slug')

  if (slugColumn) {
    slugColumn.cell = ({ row }) => makeLinkRow(row, 'slug')
  }

  if (nameColumn) {
    nameColumn.cell = ({ row }) => makeLinkRow(row, 'name')
  }

  return [orderColumn.value, ...baseColumns, ...props.columns].filter(
    (c): c is TableColumn<T> => c != null
  )
})

// Set items order based on repeater index
function setItemsOrder(rows: TableListItem<T>[]) {
  rows.forEach((item, index) => {
    if ('order' in item) {
      item.order = index
    }
  })
}

const items = ref<TableListItem<T>[]>([])

async function saveItemsOrder(rows: TableListItem<T>[]) {
  try {
    await $adminApi(`/${entityModel.value}/reorder`, {
      method: 'PUT',
      body: rows
    })

    notify.success({ description: $t('notification.success.reorder') })
  } catch {
    notify.error()
  }
}

const itemIsReorderable = computed(() => {
  if (!paginatedList.value?.data?.[0]) return

  return 'order' in paginatedList.value.data[0]
})

const draggedItems = computed<TableListItem<T>[]>({
  get(): TableListItem<T>[] {
    return items.value.length
      ? (items.value as TableListItem<T>[])
      : (paginatedList.value?.data ?? [])
  },
  set(newItems) {
    if (itemIsReorderable.value) {
      setItemsOrder(newItems)

      // Save items order to database
      saveItemsOrder(newItems)
    }

    items.value = newItems ?? []
  }
})

const { option } = useSortable('.table-tbody', draggedItems)
option('animation', 150)
</script>
