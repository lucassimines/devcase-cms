<template>
  <NuxtImg :src="`/images/logo${mono ? '-mono' : ''}.svg`" alt="Logo" :class="logo({ size })" />
</template>

<script setup lang="ts">
interface Props {
  size?: 'xs'
  mono?: boolean
}

withDefaults(defineProps<Props>(), {
  size: 'xs'
})

const logo = tv({
  variants: {
    size: {
      xs: 'w-8 sm:w-10'
    }
  }
})
</script>
