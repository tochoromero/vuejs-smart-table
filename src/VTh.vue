<template>
  <th
    :class="sortClass"
    @click="sort"
  >
    <template v-if="!hideSortIcons">
      <template v-if="order === -1">
        <slot name="descIcon">
          <svg
              width="16"
              height="16"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 320 512"
          >
            <path
                fill="currentColor"
                d="M41 288h238c21.4 0 32.1 25.9 17 41L177 448c-9.4 9.4-24.6 9.4-33.9 0L24 329c-15.1-15.1-4.4-41 17-41z"
            />
          </svg>
        </slot>
      </template>
      <template v-else-if="order === 0">
        <slot
            name="sortIcon"
        >
          <svg
              width="16"
              height="16"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 320 512"
          >
            <path
                fill="currentColor"
                d="M41 288h238c21.4 0 32.1 25.9 17 41L177 448c-9.4 9.4-24.6 9.4-33.9 0L24 329c-15.1-15.1-4.4-41 17-41zm255-105L177 64c-9.4-9.4-24.6-9.4-33.9 0L24 183c-15.1 15.1-4.4 41 17 41h238c21.4 0 32.1-25.9 17-41z"
            />
          </svg>
        </slot>
      </template>
      <template v-else-if="order === 1">
        <slot name="ascIcon">
          <svg
              width="16"
              height="16"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 320 512"
          >
            <path
                fill="currentColor"
                d="M279 224H41c-21.4 0-32.1-25.9-17-41L143 64c9.4-9.4 24.6-9.4 33.9 0l119 119c15.2 15.1 4.5 41-16.9 41z"
            />
          </svg>
        </slot>
      </template>
    </template>
    <slot />
  </th>
</template>

<script lang="ts">
import { uuid } from './table-utils'
import { computed, defineComponent, ref, watch, onMounted, PropType, nextTick } from 'vue'
import { CustomSort, SortKey } from './types'
import { useStore } from './use-store'

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
  emits: ['defaultSort'],
  setup (props, { emit }) {
    const { sortId, hideSortIcons, setSort } = useStore()

    if (!props.sortKey && !props.customSort) {
      throw new Error('Must provide the Sort Key value or a Custom Sort function.')
    }

    const id = uuid()
    const orderClasses = ['vt-desc', 'vt-sortable', 'vt-asc']
    const order = ref(0)

    onMounted(() => {
      if (props.defaultSort) {
        order.value = props.defaultSort === 'desc' ? -1 : 1
        setSort({
          sortOrder: order.value,
          sortKey: props.sortKey,
          customSort: props.customSort,
          sortId: id
        })
        nextTick(() => {
          emit('defaultSort')
        })
      }
    })

    const sortClass = computed(() => {
      return hideSortIcons.value ? [orderClasses[order.value + 1], 'vt-sort'] : []
    })

    watch(sortId, () => {
      if (sortId.value !== id && order.value !== 0) {
        order.value = 0
      }
    })

    const sort = () => {
      order.value = [0, -1].includes(order.value) ? order.value + 1 : -1
      setSort({
        sortOrder: order.value,
        sortKey: props.sortKey,
        customSort: props.customSort,
        sortId: id
      })
    }

    return {
      order,
      sortClass,
      sort,
      hideSortIcons
    }
  }
})
</script>

<style scoped>
  .vt-sort {
    cursor: pointer;
  }
</style>
