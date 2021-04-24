import { defineComponent, watch, toRef, PropType, h } from 'vue-demi'
import { Filters, SelectionMode } from './types'
import { useStore } from './use-store'

export default defineComponent({
  name: 'VTable',
  props: {
    data: {
      type: Array,
      required: true
    },
    filters: {
      type: Object as PropType<Filters>,
      required: false,
      default: () => ({})
    },
    currentPage: {
      type: Number,
      required: false,
      default: undefined
    },
    pageSize: {
      type: Number,
      required: false,
      default: undefined
    },
    selectionMode: {
      type: String as PropType<SelectionMode>,
      required: false,
      default: 'single',
      validator: (val: string) => ['single', 'multiple'].includes(val)
    },
    selectedClass: {
      required: false,
      type: String,
      default: 'vt-selected'
    },
    customSelection: {
      required: false,
      type: Boolean
    },
    hideSortIcons: {
      required: false,
      type: Boolean
    }
  },
  emits: ['loaded', 'displayData'],
  setup (props, { emit, slots }) {
    const { displayData, syncProp } = useStore()

    let initialLoad = false
    watch(displayData, () => {
      if (!initialLoad) {
        initialLoad = true
        emit('loaded')
      }

      emit('displayData', displayData.value)
    }, { immediate: true })

    syncProp('data', toRef(props, 'data'))
    syncProp('filters', toRef(props, 'filters'), true)
    syncProp('currentPage', toRef(props, 'currentPage'))
    syncProp('pageSize', toRef(props, 'pageSize'))
    syncProp('selectionMode', toRef(props, 'selectionMode'))
    syncProp('selectedClass', toRef(props, 'selectedClass'))
    syncProp('customSelection', toRef(props, 'customSelection'))
    syncProp('hideSortIcons', toRef(props, 'hideSortIcons'))

    return () => {
      return h('table', [
        h('thead', slots.head? slots.head() : undefined),
        h('tbody', slots.body? slots.body({ rows: displayData.value }) : undefined)
      ])
    }
  }
})
