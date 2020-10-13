import { reactive } from 'vue'

export default function createStore () {
  const store = reactive({
    selectedRows: [],
    selectionMode: 'single',
    customSelection: null,
    selectedClass: null,
    hideSortIcons: null,
    sortId: null,
    sortKey: null,
    customSort: null,
    sortOrder: null
  })

  store.selectRow = (row) => {
    if (store.selectionMode === 'single') {
      store.selectedRows = [row]
      return
    }

    if (!store.selectedRows.includes(row)) {
      store.selectedRows = store.selectRows.push(row)
    }
  }

  store.selectRows = (rows) => {
    for (const row of rows) {
      store.selectRow(row)
    }
  }

  store.deselectRow = (row) => {
    const index = store.selectedRows.indexOf(row)

    if (index > -1) {
      store.selectedRows = store.selectedRows.splice(index, 1)
    }
  }

  store.deselectRows = (rows) => {
    for (const row of rows) {
      store.deselectRow(row)
    }
  }

  store.selectAll = (all) => {
    store.selectedRows = all
  }

  store.deselectAll = () => {
    store.selectedRows = []
  }

  store.setSort = ({ sortKey, customSort, sortOrder, sortId }) => {
    store.sortKey = sortKey
    store.customSort = customSort
    store.sortOrder = sortOrder
    store.sortId = sortId
  }

  return store
}
