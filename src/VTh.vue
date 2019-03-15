<template>
  <th @click="sort" :class="sortClass">
    <template v-if="!state.hideSortIcons">
      <slot name="ascIcon" v-if="order === -1">
        <svg width="16" height="16" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">
          <path fill="currentColor"
                d="M279 224H41c-21.4 0-32.1-25.9-17-41L143 64c9.4-9.4 24.6-9.4 33.9 0l119 119c15.2 15.1 4.5 41-16.9 41z"></path>
        </svg>
      </slot>
      <slot name="sortIcon" v-else-if="order === 0">
        <svg width="16" height="16" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">
          <path fill="currentColor"
                d="M41 288h238c21.4 0 32.1 25.9 17 41L177 448c-9.4 9.4-24.6 9.4-33.9 0L24 329c-15.1-15.1-4.4-41 17-41zm255-105L177 64c-9.4-9.4-24.6-9.4-33.9 0L24 183c-15.1 15.1-4.4 41 17 41h238c21.4 0 32.1-25.9 17-41z"></path>
        </svg>
      </slot>
      <slot name="descIcon" v-else-if="order === 1">
        <svg width="16" height="16" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">
          <path fill="currentColor"
                d="M41 288h238c21.4 0 32.1 25.9 17 41L177 448c-9.4 9.4-24.6 9.4-33.9 0L24 329c-15.1-15.1-4.4-41 17-41z"></path>
        </svg>
      </slot>
    </template>
    <slot></slot>
  </th>
</template>

<script>
import { uuid } from './table-utils'

export default {
  name: 'v-th',
  props: {
    sortKey: {
      required: false,
      type: [String, Function]
    },
    customSort: {
      required: false,
      type: Function
    },
    defaultSort: {
      required: false,
      type: String,
      validator: value => ['asc', 'desc'].includes(value)
    }
  },
  inject: ['store'],
  data () {
    return {
      id: uuid(),
      order: 0,
      orderClasses: ['vt-desc', 'vt-sortable', 'vt-asc'],
      state: this.store._data
    }
  },
  computed: {
    sortEnabled () {
      return this.sortKey || typeof this.customSort === 'function'
    },
    sortId () {
      return this.state.sortId
    },
    sortClass () {
      return this.state.hideSortIcons ? [this.orderClasses[this.order + 1], 'vt-sort'] : []
    }
  },
  watch: {
    sortId (sortId) {
      if (sortId !== this.id && this.order !== 0) {
        this.order = 0
      }
    }
  },
  mounted () {
    if (!this.sortKey && !this.customSort) {
      throw new Error('Must provide the Sort Key value or a Custom Sort function.')
    }

    if (this.defaultSort) {
      this.order = this.defaultSort === 'desc' ? -1 : 1
      this.store.setSort({
        sortOrder: this.order,
        sortKey: this.sortKey,
        customSort: this.customSort,
        sortId: this.id
      })
      this.$nextTick(() => {
        this.$emit('defaultSort')
      })
    }
  },
  methods: {
    sort: function () {
      if (this.sortEnabled) {
        this.order = this.order === 0 || this.order === -1 ? this.order + 1 : -1
        this.store.setSort({
          sortOrder: this.order,
          sortKey: this.sortKey,
          customSort: this.customSort,
          sortId: this.id
        })
      }
    }
  }
}
</script>

<style scoped>
  .vt-sort {
    cursor: pointer;
  }
</style>
