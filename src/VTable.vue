<template>
  <table>
    <slot name="head"/>
    <slot name="body" :displayData="displayData"/>
  </table>
</template>

<script>
import { doFilter, doSort, calculateTotalPages, doPaginate } from './table-utils'
import store from './store'
import Vue from 'vue'

export default {
  name: 'SmartTable',
  props: {
    data: {
      required: true,
      type: Array
    },
    filters: {
      required: false,
      type: Object
    },
    currentPage: {
      required: false,
      type: Number
    },
    pageSize: {
      required: false,
      type: Number
    },
    allowSelection: {
      required: false,
      type: Boolean,
      default: false
    },
    selectionMode: {
      required: false,
      type: String,
      default: 'single'
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
  beforeCreate () {
    this.store = new Vue(store)
  },
  provide () {
    return {
      store: this.store
    }
  },
  data () {
    return {
      state: this.store._data,
      initialLoad: false
    }
  },
  computed: {
    needsPaginationReset () {
      return this.currentPage > this.totalPages
    },
    filteredData () {
      if (this.data.length === 0) {
        return []
      }

      if (typeof this.filters !== 'object') {
        return this.data
      }

      return doFilter(this.data, this.filters)
    },
    totalItems () {
      return this.filteredData.length
    },
    sortedData () {
      if ((this.state.sortKey || this.state.customSort) && this.state.sortOrder !== 0) {
        return doSort(this.filteredData, this.state.sortKey, this.state.customSort, this.state.sortOrder)
      }

      return this.filteredData
    },
    totalPages () {
      if (!this.pageSize) return 0

      return calculateTotalPages(this.totalItems, this.pageSize)
    },
    displayData () {
      if (this.pageSize) {
        return doPaginate(this.sortedData, this.pageSize, this.currentPage)
      }

      return this.sortedData
    },
    selectedRows () {
      return this.state.selectedRows
    }
  },
  watch: {
    displayData: {
      handler () {
        if (!this.initialLoad) {
          this.initialLoad = true
          this.$emit('loaded', this)
        }
      },
      immediate: true
    },
    selectionMode: {
      handler (mode) {
        this.state.selectionMode = mode
      },
      immediate: true
    },
    selectedClass: {
      handler (selectedClass) {
        this.state.selectedClass = selectedClass
      },
      immediate: true
    },
    customSelection: {
      handler (customSelection) {
        this.state.customSelection = customSelection
      },
      immediate: true
    },
    hideSortIcons: {
      handler (hideSortIcons) {
        this.state.hideSortIcons = hideSortIcons
      },
      immediate: true
    },
    needsPaginationReset: {
      handler (needsReset) {
        if (needsReset) {
          this.$emit('update:currentPage', 1)
        }
      },
      immediate: true
    },
    totalPages: {
      handler (totalPages) {
        this.$emit('totalPagesChanged', totalPages)
      },
      immediate: true
    },
    totalItems: {
      handler (totalItems) {
        this.$emit('totalItemsChanged', totalItems)
      },
      immediate: true
    },
    selectedRows: {
      handler (selected) {
        this.$emit('selectionChanged', selected)
      },
      immediate: true
    }
  },
  methods: {
    revealItem (item) {
      if (!this.pageSize) {
        return true
      }

      let index
      if (typeof item === 'function') {
        index = this.sortedData.findIndex(item)
      } else {
        index = this.sortedData.indexOf(item)
      }

      if (index === -1) {
        return false
      }

      const currentPage = Math.ceil((index + 1) / this.pageSize)
      this.$emit('update:currentPage', currentPage)

      return true
    },
    revealPage (page) {
      if (!this.pageSize || Number.isNaN(page) || page < 1) {
        return
      }

      this.$emit('update:currentPage', page)
    },
    selectRow (row) {
      this.store.selectRow(row)
    },
    selectRows (rows) {
      this.store.selectRows(rows)
    },
    deselectRow (row) {
      this.store.deselectRow(row)
    },
    deselectRows (rows) {
      this.store.deselectRows(rows)
    },
    selectAll () {
      if (this.selectionMode === 'single') return

      this.store.selectAll(this.data)
    },
    deselectAll () {
      this.store.deselectAll()
    }
  }
}
</script>
