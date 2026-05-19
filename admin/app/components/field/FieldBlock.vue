<template>
  <Component :is="resolvedComponent" v-model="model" :accessor-key="accessorKey" />
</template>

<script setup lang="ts">
import FieldBlockImage from '~/components/field/block/FieldBlockImage.vue'
import FieldBlockTextImage from '~/components/field/block/FieldBlockTextImage.vue'
import FieldBlockText from '~/components/field/block/FieldBlockText.vue'
import FieldBlockWeb from '~/components/field/block/FieldBlockWeb.vue'
import { blockType, type Block, type BlockType } from '~/types/block'

const props = defineProps<{
  accessorKey: string
  type: BlockType
}>()

const model = defineModel<Block['content']>({ required: true })

const components = {
  [blockType.TEXT]: FieldBlockText,
  [blockType.WEB]: FieldBlockWeb,
  [blockType.IMAGE]: FieldBlockImage,
  [blockType.TEXT_IMAGE]: FieldBlockTextImage
}

const resolvedComponent = computed(() => {
  return components[props.type] || FieldBlockText
})
</script>
