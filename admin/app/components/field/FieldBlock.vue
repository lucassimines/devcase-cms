<template>
  <div>
    <FieldRepeater
      v-model="modelBlocks"
      name="blocks"
      :default-item="createBlockInput()"
      :label="$t('block.label')"
      #="{ accessorKey, model }"
    >
      <div class="relative">
        <USelect
          v-model="model.type"
          value-key="value"
          :items="blockTypeOptions"
          size="xl"
          class="w-full"
          @change="handleBlockTypeChange(model)"
        />
      </div>

      <FieldBlockText
        v-if="model.type === blockType.TEXT"
        v-model="model.content"
        :accessor-key="accessorKey"
      />

      <FieldBlockWeb
        v-else-if="model.type === blockType.WEB"
        v-model="model.content"
        :accessor-key="accessorKey"
      />
    </FieldRepeater>
  </div>
</template>

<script setup lang="ts">
import { blockType, type Block } from '~/types/block'

const { createTextBlockInput, createWebBlockInput } = useFormBlocks()

function createBlockInput(): Block {
  return {
    type: blockType.TEXT,
    content: createTextBlockInput()
  }
}

const modelBlocks = defineModel<Block[]>({ required: true, default: [] })

const blockTypeOptions = computed(() => {
  return Object.entries(blockType).map(([_key, value]) => ({
    label: $t(`block.${value}`),
    value: value
  }))
})

function handleBlockTypeChange(model: Block) {
  switch (model.type) {
    case blockType.WEB:
      model.content = createWebBlockInput()
      break
    default:
      model.content = createTextBlockInput()
      break
  }
}
</script>
