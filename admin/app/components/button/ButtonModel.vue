<template>
  <UButton
    :icon="$entities[entity].icon"
    :label="$t(`entity.${entity}.name`, 2)"
    variant="soft"
    color="neutral"
    :to="{ name: $entities[entity].path }"
  />
</template>

<script setup lang="ts">
import type { EntityKey } from '~/types/entity'

defineProps<{
  entity: EntityKey
}>()
</script>
