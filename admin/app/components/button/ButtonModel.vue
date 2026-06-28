<template>
  <UButton
    :icon="$entities[entity].icon"
    :label="$t(`entity.${entity}.name`, 2)"
    variant="soft"
    color="neutral"
    :to="{ path: entityPath }"
  />
</template>

<script setup lang="ts">
import type { EntityKey } from '~/types/entity'

const props = defineProps<{
  entity: EntityKey
  path?: string
}>()

const { $entities } = useNuxtApp()

const entityPath = computed(() => {
  if (props.path) return props.path

  const entity = $entities[props.entity]
  return 'path' in entity ? entity.path : ''
})
</script>
