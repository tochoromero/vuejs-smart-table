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
import store from './store'

export default {
  name: 'v-tr',
  props: {
    row: {
      required: true
    }
  },
  data: () => ({
    state: store.state
  }),
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
          store.deselectRow(this.row)
        } else {
          store.selectRow(this.row)
        }
      }
    }
  }
}
</script>
