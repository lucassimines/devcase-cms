<template>
  <div class="flex flex-col gap-4">
    <UPageFeature :title="labels.title" />

    <Draggable
      v-if="draggedItems?.length"
      v-model="draggedItems"
      item-key="index"
      handle=".handle"
      class="flex flex-col gap-3"
    >
      <template #item="{ index }: { index: number }">
        <div class="bg-muted flex flex-col gap-4 rounded-md p-4" :data-item="`${name}-${index}`">
          <header v-if="max > 1" class="flex items-center justify-between gap-2">
            <UButton
              icon="lucide:grip-vertical"
              class="handle cursor-grab px-0 active:cursor-grabbing"
              color="neutral"
              variant="link"
              :label="`${typeof labels.header === 'function' ? labels.header(index, draggedItems.length) : labels.header}`"
            />

            <UButton
              icon="lucide:x"
              class="rounded-full"
              size="xs"
              color="neutral"
              variant="subtle"
              @click="removeItem(index)"
            />
          </header>

          <div class="flex flex-col gap-4">
            <slot :accessor-key="`${name}.${index}`" :index="index" :model="model[index]!" />
          </div>
        </div>
      </template>
    </Draggable>

    <div v-if="draggedItems.length < max" class="flex justify-end gap-6">
      <USeparator v-if="!draggedItems?.length" :ui="{ border: 'border-accented' }" />

      <UButton
        :label="t('button.add', { name: labels.item }, 2)"
        variant="soft"
        @click="addItem()"
      />
    </div>
  </div>
</template>

<script setup lang="ts" generic="T extends object">
import type { VNode } from 'vue'
import { useI18n } from 'vue-i18n'
import Draggable from 'vuedraggable'

interface Props {
  name: string
  defaultItem: T
  max?: number
  label?: string
  itemLabel?: string
  headerLabel?: string | ((index: number, total: number) => string)
}

const props = withDefaults(defineProps<Props>(), {
  max: Infinity
})

const { t } = useI18n()

const model = defineModel<T[]>({ required: true })

defineSlots<{
  default: (slotProps: { accessorKey: string; index: number; model: T }) => VNode
}>()

const labels = computed(() => {
  return {
    title: props.label || t('item', 2),
    item: props.itemLabel || t('item', 1),
    header: props.headerLabel || props.itemLabel || t('item', 1)
  }
})

// Set items order based on repeater index
const setItemsOrder = (items: (T & { order: number })[]) => {
  items.forEach((item, index) => {
    if (item.order !== undefined) item.order = index
  })
}

const draggedItems = computed({
  get() {
    return model.value
  },
  set(newItems) {
    // If the default item has an order, set the items order
    if ('order' in props.defaultItem) {
      setItemsOrder(newItems as (T & { order: number })[])
    }

    model.value = newItems
  }
})

function cloneDefaultItem(): T {
  // Important: defaultItem can contain nested objects; shallow spread would share references.
  // Prefer structuredClone (native deep clone) with a JSON fallback.
  if (typeof structuredClone === 'function') return structuredClone(props.defaultItem)
  return JSON.parse(JSON.stringify(props.defaultItem)) as T
}

function addItem() {
  // If the repeater is empty, initialize "draggedItems" with the first item from the list
  if (!draggedItems.value.length) {
    draggedItems.value = [cloneDefaultItem()]
    return
  }

  draggedItems.value?.push(cloneDefaultItem())
}

function removeItem(index: number) {
  draggedItems.value.splice(index, 1)
}
</script>
