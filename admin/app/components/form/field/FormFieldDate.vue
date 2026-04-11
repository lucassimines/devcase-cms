<template>
  <UInputDate ref="inputDate" v-model="dateValue" size="xl">
    <template #trailing>
      <UPopover :reference="inputDate?.inputsRef[3]?.$el">
        <UButton
          color="neutral"
          variant="link"
          icon="i-lucide-calendar"
          aria-label="Select a date"
          class="px-0"
        />

        <template #content>
          <UCalendar v-model="dateValue" class="p-2" />
        </template>
      </UPopover>
    </template>
  </UInputDate>
</template>

<script setup lang="ts">
import type { DateValue } from '@internationalized/date'

const model = defineModel<string>({ required: true })

const { parseISO } = useDate()

const inputDate = useTemplateRef('inputDate')

const dateValue = computed<DateValue>({
  get: () => {
    return parseISO(model.value)
  },
  set: (val) => {
    model.value = val.toString()
  }
})
</script>
