<template>
  <table>
    <thead>
      <slot name="head" />
    </thead>
    <tbody>
      <slot
          name="body"
          :rows="displayData"
      />
    </tbody>
  </table>
</template>

<script lang="ts">
import { defineComponent, watch, toRef, PropType } from 'vue'
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
  setup (props, { emit }) {
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
    syncProp('filters', toRef(props, 'filters'))
    syncProp('currentPage', toRef(props, 'currentPage'))
    syncProp('pageSize', toRef(props, 'pageSize'))
    syncProp('selectionMode', toRef(props, 'selectionMode'))
    syncProp('selectedClass', toRef(props, 'selectedClass'))
    syncProp('customSelection', toRef(props, 'customSelection'))
    syncProp('hideSortIcons', toRef(props, 'hideSortIcons'))

    return {
      displayData
    }
  }
})
</script>
