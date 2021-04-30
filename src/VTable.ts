import { defineComponent, watch, toRef, PropType, h } from 'vue-demi'
import { Filters, SelectionMode, TableState } from './types'
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
      type: Boolean,
      default: false
    },
    hideSortIcons: {
      required: false,
      type: Boolean,
      default: false
    }
  },
  emits: {
    stateChanged: (state: TableState) => true
  },
  setup (props, { emit }) {
    const {
      tableState,
      syncProp,
      selectAll,
      deselectAll,
      selectRows,
      selectedRows
    } = useStore()

    watch(tableState, rows => {
      emit('stateChanged', tableState.value)
    }, { immediate: true, deep: true })

    syncProp('data', toRef(props, 'data'))
    syncProp('filters', toRef(props, 'filters'), true)
    syncProp('currentPage', toRef(props, 'currentPage'))
    syncProp('pageSize', toRef(props, 'pageSize'))
    syncProp('selectionMode', toRef(props, 'selectionMode'))
    syncProp('selectedClass', toRef(props, 'selectedClass'))
    syncProp('customSelection', toRef(props, 'customSelection'))
    syncProp('hideSortIcons', toRef(props, 'hideSortIcons'))

    return {
      tableState,
      selectAll,
      deselectAll,
      selectRows
    }
  },
  render () {
    return h('table', [
      h('thead', this.$slots.head ? this.$slots.head() : undefined),
      h('tbody', this.$slots.body? this.$slots.body({ rows: this.tableState.rows }) : undefined)
    ])
  }
})
