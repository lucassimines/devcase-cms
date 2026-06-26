<template>
  <div>
    <FieldRepeater
      v-model="modelBlocks"
      name="blocks"
      :default-item="createBlockInput()"
      :label="$t('block')"
    >
      <template #default="{ accessorKey, model }">
        <div class="relative">
          <USelect
            v-model="model.type"
            value-key="value"
            :items="blockTypeOptions"
            @change="handleBlockTypeChange(model)"
          />
        </div>

        <FieldBlock v-model="model.content" :type="model.type" :accessor-key="accessorKey" />
      </template>
    </FieldRepeater>
  </div>
</template>

<script setup lang="ts">
import { blockType, type Block } from '~/types/block'

const {
  createTextBlockInput,
  createWebBlockInput,
  createImageBlockInput,
  createTextImageBlockInput
} = useFormBlocks()

function createBlockInput(): Block {
  return {
    type: blockType.TEXT,
    content: createTextBlockInput()
  }
}

const modelBlocks = defineModel<Block[]>({ required: true })

const blockTypeOptions = computed(() => {
  return Object.entries(blockType).map(([_key, value]) => ({
    label: $t(value),
    value: value
  }))
})

function handleBlockTypeChange(model: Block) {
  switch (model.type) {
    case blockType.WEB:
      model.content = createWebBlockInput()
      break
    case blockType.IMAGE:
      model.content = createImageBlockInput()
      break
    case blockType.TEXT_IMAGE:
      model.content = createTextImageBlockInput()
      break
    default:
      model.content = createTextBlockInput()
      break
  }
}
</script>
