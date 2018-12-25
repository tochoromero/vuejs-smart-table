export default {
  state: {
    selectedRows: [],
    selectionMode: 'single',
    customSelection: null,
    selectedClass: null,
    hideSortIcons: null,
    sortId: null,
    sortKey: null,
    customSort: null,
    sortOrder: null
  },
  selectRow (row) {
    if (this.state.selectionMode === 'single') {
      this.state.selectedRows = [row]
      return
    }

    const index = this.state.selectedRows.indexOf(row)
    if (index === -1) {
      this.state.selectedRows.push(row)
    }
  },
  deselectRow (row) {
    const index = this.state.selectedRows.indexOf(row)

    if (index > -1) {
      this.state.selectedRows.splice(index, 1)
    }
  },
  setSort ({ sortKey, customSort, sortOrder, sortId }) {
    this.state.sortKey = sortKey
    this.state.customSort = customSort
    this.state.sortOrder = sortOrder
    this.state.sortId = sortId
  }
}
