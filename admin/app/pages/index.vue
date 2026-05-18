<template>
  <UDashboardPanel>
    <template #header>
      <UDashboardNavbar title="Dashboard" />
    </template>

    <template #body>
      <Container>
        <div class="grid gap-4 sm:grid-cols-2">
          <ULink
            v-for="card in dashboardCards"
            :key="card.path"
            :to="card.path"
            class="group focus-visible:ring-primary rounded-lg focus:outline-none focus-visible:ring-2"
          >
            <UCard>
              <div class="flex items-start justify-between gap-4">
                <div class="space-y-1">
                  <p class="text-muted text-sm">Total</p>
                  <p class="text-2xl font-semibold tabular-nums" v-text="card.total" />
                </div>

                <UIcon :name="card.icon" class="text-muted group-hover:text-primary text-xl" />
              </div>

              <div class="mt-4 flex items-center justify-between gap-2">
                <p class="font-medium" v-text="card.label" />
                <UIcon
                  name="lucide:arrow-right"
                  class="text-muted group-hover:text-primary text-base transition group-hover:translate-x-1"
                />
              </div>
            </UCard>
          </ULink>
        </div>
      </Container>
    </template>
  </UDashboardPanel>
</template>

<script setup lang="ts">
interface DashboardStats {
  pages: number
  projects: number
}

const { $entities } = useNuxtApp()

const { data: stats, status } = await useAdminApi<DashboardStats>('/dashboard')

const dashboardCards = computed(() => {
  return [
    {
      label: $entities.page.label,
      path: $entities.page.path,
      icon: $entities.page.icon,
      total: status.value === 'pending' ? '...' : (stats.value?.pages ?? 0)
    },
    {
      label: $entities.project.label,
      path: $entities.project.path,
      icon: $entities.project.icon,
      total: status.value === 'pending' ? '...' : (stats.value?.projects ?? 0)
    }
  ]
})
</script>
