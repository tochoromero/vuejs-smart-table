<template>
  <tr
    :class="[rowClass]"
    :style="style"
    @click="handleRowSelected"

  >
    <slot></slot>
  </tr>
</template>

<script>

export default {
  name: 'v-tr',
  props: {
    row: {
      required: true
    }
  },
  inject: ['store'],
  data () {
    return {
      state: this.store._data
    }
  },
  mounted () {
    if (!this.state.customSelection) {
      this.$el.style.cursor = 'pointer'
    }
  },
  beforeDestroy () {
    if (!this.state.customSelection) {
      this.$el.removeEventListener('click', this.handleRowSelected)
    }
  },
  computed: {
    isSelected () {
      return this.state.selectedRows.find(it => it === this.row)
    },
    rowClass: function () {
      return this.isSelected ? this.state.selectedClass : ''
    },
    style () {
      return {
        ...(!this.state.customSelection ? { cursor: 'pointer' } : {})
      }
    }
  },
  methods: {
    handleRowSelected (event) {
      if (this.state.customSelection) return

      let source = event.target || event.srcElement
      if (source.tagName.toLowerCase() === 'td') {
        if (this.isSelected) {
          this.store.deselectRow(this.row)
        } else {
          this.store.selectRow(this.row)
        }
      }
    }
  }
}
</script>
