import { uuid } from './table-utils'
import { computed, defineComponent, h, isVue2, nextTick, onMounted, PropType, ref, watch, inject, getCurrentInstance } from 'vue-demi'
import { CustomSort, SortKey, SortOrder } from './types'
import { createSortIcon } from './icon-utils'
import { storeKey } from './VTable'

export default defineComponent({
  name: 'VTh',
  props: {
    canSort: { type: Boolean, default: true },
    sortKey: {
      type: [String, Function, Boolean] as PropType<SortKey>,
      required: false,
      default: null
    },
    customSort: {
      type: [Function, Object] as PropType<CustomSort>,
      required: false,
      default: null
    },
    defaultSort: {
      type: String as PropType<'asc' | 'desc' | null>,
      required: false,
      validator: (value: any) => ['asc', 'desc', null].includes(value),
      default: null
    }
  },
  emits: ['defaultSort', 'sortChanged'],
  setup(props, { emit, slots }) {
    const store = inject(storeKey)!

    if (props.canSort !== false && !props.sortKey && !props.customSort) {
      throw new Error('Must provide the Sort Key value or a Custom Sort function.')
    }
    
    const internalInstance = getCurrentInstance()
    const parentInstance = internalInstance?.parent?.proxy
    if (!parentInstance || parentInstance?.$options.name !== 'VTable') {
      throw new Error('VTh must be used in the header slot of VTable.')
    }

    const id = uuid()
    const order = ref<SortOrder>(SortOrder.NONE)

    onMounted(() => {
      if (props.defaultSort) {
        order.value = props.defaultSort === 'desc' ? SortOrder.DESC : SortOrder.ASC
        store.setSort({
          sortOrder: order.value,
          sortKey: props.sortKey,
          customSort: props.customSort,
          sortId: id
        })
        nextTick(() => {
          emit('defaultSort')
          emit('sortChanged', { sortOrder: order.value})
        })
      }
    })

    const sortIcon = computed(() => {
      if (store.state.hideSortIcons || !props.canSort) {
        return
      }

      return createSortIcon(order.value)
    })

    watch(() => store.state.sortId, () => {
      if (store.state.sortId !== id && order.value !== 0) {
        order.value = 0
      }
    })

    const sort = () => {
      if (!props.canSort) return
      
      if ([SortOrder.DESC, SortOrder.NONE].includes(order.value)) {
        order.value = SortOrder.ASC
      } else {
        order.value = SortOrder.DESC
      }

      store.setSort({
        sortOrder: order.value,
        sortKey: props.sortKey,
        customSort: props.customSort,
        sortId: id
      })

      emit('sortChanged', { sortOrder: order.value })
    }

    const children = computed(() => {
      const children: any = []

      if (store.state.sortIconPosition === 'before' && !store.state.hideSortIcons) {
        children.push(sortIcon.value)
      }

      if (slots.default) {
        children.push(h('span', [slots.default({
          sortOrder: order.value,
          rows: (parentInstance as any).tableState.rows,
          selectedRows: (parentInstance as any).tableState.selectedRows,
          selectAll: () => (parentInstance as any).selectAll(),
          deselectAll: () => (parentInstance as any).deselectAll(),
        })]))
      }

      if (store.state.sortIconPosition === 'after' && !store.state.hideSortIcons) {
        children.push(sortIcon.value)
      }

      return children
    })

    return () => {
      return h('th', {
        class: 'v-th',
        ...(isVue2 ? {
          on: {
            click: sort
          }
        } : {
          onClick: sort
        })
      }, [
        h('div', { class: store.state.sortHeaderClass }, children.value)
      ])
    }
  }
})
