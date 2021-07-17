import { uuid } from './table-utils'
import { computed, defineComponent, h, isVue2, nextTick, onMounted, PropType, ref, watch, inject } from 'vue-demi'
import { CustomSort, SortKey, SortOrder } from './types'
import { createSortIcon } from './icon-utils'
import { storeKey } from './VTable'

export default defineComponent({
  name: 'VTh',
  props: {
    sortKey: {
      type: [String, Function] as PropType<SortKey>,
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

    if (!props.sortKey && !props.customSort) {
      throw new Error('Must provide the Sort Key value or a Custom Sort function.')
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
      if (store.state.hideSortIcons) {
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
        children.push(h('span', [slots.default({ sortOrder: order.value })]))
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
