<template>
  <tr
    :class="[rowClass]"
    :style="style"
    @click="handleRowSelected"
  >
    <slot v-bind="{ isSelected }" />
  </tr>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import { useStore } from './use-store'

export default defineComponent({
  name: 'VTr',
  props: {
    row: {
      type: Object,
      required: true
    }
  },
  setup (props: any) {
    const { selectedRows, selectedClass, customSelection, deselectRow, selectRow } = useStore()

    const isSelected = computed(() => selectedRows.value.find((it: any) => it === props.row))
    const rowClass = computed(() => isSelected.value ? selectedClass.value : '')
    const style = computed(() => ({ ...(!customSelection.value ? { cursor: 'pointer' } : {}) }))

    const handleRowSelected = (event: Event) => {
      if (customSelection.value) {
        return
      }

      const source = event.target as HTMLElement
      if (source && source.tagName.toLowerCase() === 'td') {
        if (isSelected.value) {
          deselectRow(props.row)
        } else {
          selectRow(props.row)
        }
      }
    }

    return {
      rowClass,
      style,
      handleRowSelected,
      isSelected
    }
  }
})
</script>
