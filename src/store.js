export default {
  data: () => ({
    selectedRows: [],
    selectionMode: 'single',
    customSelection: null,
    selectedClass: null,
    hideSortIcons: null,
    sortId: null,
    sortKey: null,
    customSort: null,
    sortOrder: null
  }),
  methods: {
    selectRow (row) {
      if (this.selectionMode === 'single') {
        this.selectedRows = [row]
        return
      }

      const index = this.selectedRows.indexOf(row)
      if (index === -1) {
        this.selectedRows.push(row)
      }
    },
    selectRows (rows) {
      for (let row of rows) {
        this.selectRow(row)
      }
    },
    deselectRow (row) {
      const index = this.selectedRows.indexOf(row)

      if (index > -1) {
        this.selectedRows.splice(index, 1)
      }
    },
    deselectRows (rows) {
      for (let row of rows) {
        this.deselectRow(row)
      }
    },
    selectAll (all) {
      this.selectedRows = all
    },
    deselectAll () {
      this.selectedRows = []
    },
    setSort ({ sortKey, customSort, sortOrder, sortId }) {
      this.sortKey = sortKey
      this.customSort = customSort
      this.sortOrder = sortOrder
      this.sortId = sortId
    }
  }
}
