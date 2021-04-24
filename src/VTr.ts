import { computed, defineComponent, h } from 'vue-demi'
import { useStore } from './use-store'

export default defineComponent({
  name: 'VTr',
  props: {
    row: {
      type: Object,
      required: true
    }
  },
  setup(props: any, { slots }) {
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

    return () => {
      return h('tr', {
          class: rowClass.value,
          style: style.value,
          onClick: handleRowSelected
        },
        slots.default ? slots.default() : []
      )
    }
  }
})
