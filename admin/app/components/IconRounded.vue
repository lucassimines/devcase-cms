<template>
  <div class="icon-rounded">
    <UIcon :name="icon" />
  </div>
</template>

<script setup lang="ts">
interface Props {
  icon: string
}

defineProps<Props>()
</script>
