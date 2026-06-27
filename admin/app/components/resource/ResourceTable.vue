<template>
  <div class="flex flex-1 flex-col gap-4 sm:gap-6">
    <div class="flex flex-wrap items-center justify-between gap-1.5">
      <UInput
        v-model="searchTerm"
        class="w-full max-w-72"
        icon="lucide:search"
        :loading="pending"
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

    <div class="flex max-h-full flex-1 flex-col overflow-hidden">
      <UTable
        ref="table"
        v-model:column-visibility="columnVisibility"
        v-model:row-selection="rowSelection"
        :get-row-id="getRowId"
        :pagination="pagination"
        :data="draggedItems ?? []"
        :columns="normalizedColumns"
        :loading="pending"
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
        class="border-default mt-auto flex items-center justify-between gap-3 border-t pt-4"
      >
        <div
          class="text-muted text-sm"
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

<script
  setup
  lang="ts"
  generic="
    T extends {
      id?: string | number
      name?: string | LocalizedString
      slug?: string
      createdAt?: string
      published?: boolean
    }
  "
>
import type { TableColumn, TableRow, TableSlots } from '@nuxt/ui'
import { useSortable, type UseSortableOptions } from '@vueuse/integrations/useSortable'
import type { LocalizedString } from '~/types/locale'
import type { PaginationQuery } from '~/types/pagination'
import type { PaginatedTableList, TableListItem } from '~/types/table-list'

const props = withDefaults(
  defineProps<{
    columns: TableColumn<T>[]
    endpoint: string
    filterBy: keyof T | keyof T[]
    reorderable?: boolean
    showCreatedAt?: boolean
    showPublished?: boolean
  }>(),
  {
    showCreatedAt: true,
    showPublished: false
  }
)

defineSlots<
  TableSlots<T> & {
    'header-right': () => VNode
    'actions-cell': (props: { row: TableRow<T>; refresh: () => Promise<void> }) => VNode
  }
>()

const route = useRoute()
const { format: formatDate } = useDate()

const { $tr } = useNuxtApp()

const { locale } = useLocale()

function getColumnKey(column: TableColumn<T>) {
  if ('accessorKey' in column && column.accessorKey != null) {
    return String(column.accessorKey)
  }

  return String(column.id ?? '')
}

function isLocalizedFilterKey(key: string) {
  return props.columns.some((column) => {
    return getColumnKey(column) === key && column.meta?.localized === true
  })
}

function resolveFilterBy() {
  const keys = Array.isArray(props.filterBy) ? props.filterBy : [props.filterBy]

  return keys.map((key) => {
    const normalized = String(key)

    return isLocalizedFilterKey(normalized)
      ? makeLocalizedPath(normalized, locale.value)
      : normalized
  })
}

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
  filterBy: resolveFilterBy(),
  orderBy: props.reorderable ? { order: 'asc' } : undefined
})

watch(locale, () => {
  apiQuery.value = {
    ...apiQuery.value,
    filterBy: resolveFilterBy(),
    page: 1
  }

  paginationQuery.value.page = 1
})

// Fetch paginated data from API
const {
  data: paginatedList,
  pending,
  refresh
} = await useAdminApi<PaginatedTableList<T>>(props.endpoint, {
  query: apiQuery
})

watch(searchTermDebounced, (newTerm) => {
  if (apiQuery.value.term === newTerm) return

  apiQuery.value = {
    ...apiQuery.value,
    term: newTerm,
    page: 1
  }

  paginationQuery.value.page = 1
})

function clearSearchTerm() {
  searchTerm.value = ''

  if (apiQuery.value.term === '') return

  paginationQuery.value.page = 1

  apiQuery.value = { ...apiQuery.value, term: '', page: 1 }
}

function goToPage(page: number) {
  table.value?.tableApi?.setPageIndex(page - 1)

  paginationQuery.value.page = page

  apiQuery.value = { ...apiQuery.value, page, term: searchTermDebounced.value }
}

const notify = useNotification()

// Delete selected rows
async function deleteSelectedRows() {
  try {
    const res = await $adminApi<{ count: number }>(props.endpoint, {
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
const UBadge = resolveComponent('UBadge')
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
      to: {
        name: `${route.name?.toString()}-id`,
        params: { ...route.params, id: row.id }
      },
      class: 'hover:text-primary'
    },
    () => $tr(row.original[key] as LocalizedString | string)
  )
}

const orderColumn = computed<TableColumn<T> | undefined>(() => {
  if (!props.reorderable) return

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
        class: 'drag-handle cursor-grab active:cursor-grabbing text-base hover:text-primary'
      })
    }
  }
})

const publishedColumn = computed<TableColumn<T> | undefined>(() => {
  if (!props.showPublished) return

  return {
    id: 'published',
    accessorKey: 'published',
    header: $t('status'),
    cell: ({ row }) =>
      h(UBadge, {
        label: row.original.published ? $t('published') : $t('draft'),
        color: row.original.published ? 'success' : 'neutral',
        variant: 'soft',
        size: 'sm'
      }),
    meta: {
      class: {
        th: 'w-24',
        td: 'w-24'
      }
    }
  }
})

const createdAtColumn = computed<TableColumn<T> | undefined>(() => {
  if (!props.showCreatedAt) return

  return {
    id: 'createdAt',
    accessorKey: 'createdAt',
    header: $t('date'),
    cell: ({ row }) => formatDate(row.original.createdAt),
    meta: {
      class: {
        th: 'w-32',
        td: 'w-32 text-muted'
      }
    }
  }
})

function insertBeforeActions(
  columns: TableColumn<T>[],
  column: TableColumn<T> | undefined
): TableColumn<T>[] {
  if (!column) return columns

  const actionsIndex = columns.findIndex((col) => col.id === 'actions')
  if (actionsIndex === -1) return [...columns, column]

  return [...columns.slice(0, actionsIndex), column, ...columns.slice(actionsIndex)]
}

function mergeUserColumns(columns: TableColumn<T>[]): TableColumn<T>[] {
  const withoutAutoColumns = columns.filter(
    (column) => column.id !== 'createdAt' && column.id !== 'published'
  )

  return insertBeforeActions(
    insertBeforeActions(withoutAutoColumns, createdAtColumn.value),
    publishedColumn.value
  )
}

const normalizedColumns = computed<TableColumn<T>[]>(() => {
  const nameColumn = props.columns.find((column) => column.id === 'name')
  const slugColumn = props.columns.find((column) => column.id === 'slug')

  if (slugColumn) {
    slugColumn.cell = ({ row }) => makeLinkRow(row, 'slug')
  }

  if (nameColumn) {
    nameColumn.cell = ({ row }) => makeLinkRow(row, 'name')
  }

  return [orderColumn.value, ...baseColumns, ...mergeUserColumns(props.columns)].filter(
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
    await $adminApi(`${props.endpoint}/reorder`, {
      method: 'PUT',
      body: rows
    })

    notify.success({ description: $t('notification.success.reorder') })
  } catch {
    notify.error()
  }
}

const draggedItems = computed<TableListItem<T>[]>({
  get(): TableListItem<T>[] {
    return items.value.length
      ? (items.value as TableListItem<T>[])
      : (paginatedList.value?.data ?? [])
  },
  set(newItems) {
    if (props.reorderable) {
      setItemsOrder(newItems)

      // Save items order to database
      saveItemsOrder(newItems)
    }

    items.value = newItems ?? []
  }
})

useSortable('.table-tbody', draggedItems, {
  animation: 150,
  handle: '.drag-handle'
} as UseSortableOptions)
</script>
