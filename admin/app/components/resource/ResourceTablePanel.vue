<template>
  <UDashboardPanel>
    <template #header>
      <UDashboardNavbar>
        <template #left>
          <slot name="header-left">
            <UBreadcrumb :items="normalizedBreadcrumbs" />
          </slot>
        </template>

        <template #right>
          <slot name="header-right" />
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <slot />
    </template>
  </UDashboardPanel>
</template>

<script setup lang="ts" generic="T extends { id?: string | number; name?: string; slug?: string }">
import type { BreadcrumbItem } from '@nuxt/ui'

const props = defineProps<{
  breadcrumbs?: BreadcrumbItem[]
}>()

const searchTerm = ref('')
const searchTermDebounced = refDebounced(searchTerm, 400)

const { breadcrumbs: defaultBreadcrumbs } = useBreadcrumbs()

const normalizedBreadcrumbs = computed(() => {
  return props.breadcrumbs ?? defaultBreadcrumbs.value ?? []
})

const paginationQuery = ref<PaginationQuery>({
  page: 1,
  limit: 10
})

// Single ref for API query: one update (term + page) = one fetch (avoids double fetch when searching from page > 1)
const apiQuery = ref({
  ...paginationQuery.value,
  term: searchTermDebounced.value
})

watch(searchTermDebounced, (newTerm) => {
  apiQuery.value = {
    ...apiQuery.value,
    term: newTerm,
    page: 1
  }

  paginationQuery.value.page = 1
})
</script>
