import { reactive, toRefs, computed, watch, Ref } from 'vue-demi'
import { CustomSort, Filters, SortKey, SelectionMode, SortOrder, TableState } from './types'
import { calculateTotalPages, doFilter, doPaginate, doSort } from './table-utils'

interface Sort {
  sortId: string | null;
  sortKey: SortKey;
  customSort: CustomSort;
  sortOrder: number;
}

interface State extends Sort {
  data: any[]
  filters: Filters
  selectedRows: any[]
  selectionMode: SelectionMode
  customSelection: boolean
  selectedClass: string
  hideSortIcons: boolean
  sortId: string | null
  sortKey: SortKey
  customSort: CustomSort
  sortOrder: SortOrder
  currentPage: number
  pageSize?: number
}

const state: State = reactive({
  data: [],
  filters: {},
  selectedRows: [],
  selectionMode: 'single',
  customSelection: false,
  selectedClass: '',
  hideSortIcons: false,
  sortId: null,
  sortKey: null,
  customSort: null,
  sortOrder: SortOrder.NONE,
  currentPage: 0,
  pageSize: undefined
})

export function useStore () {
  const filteredData = computed(() => {
    if (state.data.length === 0) {
      return []
    }

    if (Object.keys(state.filters).length === 0) {
      return state.data
    }

    return doFilter(state.data, state.filters)
  })

  const sortedData = computed(() => {
    if ((state.sortKey || state.customSort) && state.sortOrder !== 0) {
      return doSort(filteredData.value, state.sortKey, state.customSort, state.sortOrder)
    }

    return filteredData.value
  })

  // ============ Pagination ============ //
  const totalItems = computed(() => filteredData.value.length)

  const totalPages = computed(() => {
    if (!state.pageSize) return 0

    return calculateTotalPages(totalItems.value, state.pageSize)
  })

  const paginationEnabled = computed(() => state.currentPage && state.pageSize)

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const needsPaginationReset = computed(() => paginationEnabled.value && state.currentPage! > totalPages.value)

  watch(needsPaginationReset, () => {
    if (paginationEnabled.value) {
      state.currentPage = 1
    }
  })

  const revealPage = (page: number) => {
    if (!paginationEnabled.value || page < 1 || page > totalPages.value) {
      return
    }

    state.currentPage = page
  }

  const revealItem = (item: any | ((item: any) => boolean)) => {
    if (!paginationEnabled.value) {
      return true
    }

    let index: number
    if (typeof item === 'function') {
      index = sortedData.value.findIndex(item)
    } else {
      index = sortedData.value.indexOf(item)
    }

    if (index === -1) {
      return false
    }

    state.currentPage = Math.ceil((index + 1) / state.pageSize!)
    return true
  }

  const selectPage = (page: number) => {
    if (page < 1 || page > totalPages.value || page === state.currentPage) {
      return
    }
    state.currentPage = page
  }

  const nextPage = () => {
    if (!state.currentPage) {
      state.currentPage = 1
    } else if (state.currentPage < totalPages.value) {
      state.currentPage = state.currentPage + 1
    }
  }

  const previousPage = () => {
    if (!state.currentPage) {
      state.currentPage = 1
    } else if (state.currentPage > 1) {
      state.currentPage = state.currentPage - 1
    }
  }

  const firstPage = () => {
    state.currentPage = 1
  }

  const lastPage = () => {
    state.currentPage = totalPages.value
  }
  // ============ Pagination ============ //

  const displayData = computed(() => {
    if (paginationEnabled.value) {
      return doPaginate(sortedData.value, state.pageSize!, state.currentPage!)
    }

    return sortedData.value
  })

  const tableState = computed<TableState>(() => ({
    rows: displayData.value,
    rowsPrePagination: sortedData.value,
    selectedRows: state.selectedRows
  }))

  // ============ Selection ============ //
  const selectRow = (row: any) => {
    if (state.selectionMode === 'single') {
      state.selectedRows = [row]
      return
    }

    if (!state.selectedRows.includes(row)) {
      state.selectedRows.push(row)
    }
  }

  const selectRows = (rows: any[]) => {
    for (const row of rows) {
      selectRow(row)
    }
  }

  const deselectRow = (row: any) => {
    const index = state.selectedRows.indexOf(row)

    if (index > -1) {
      state.selectedRows.splice(index, 1)
    }
  }

  const deselectRows = (rows: any[]) => {
    for (const row of rows) {
      deselectRow(row)
    }
  }

  const selectAll = () => {
    if (state.selectionMode === 'single') {
      return
    }

    state.selectedRows = [...state.data]
  }

  const deselectAll = () => {
    state.selectedRows = []
  }
  // ============ Selection ============ //

  const setSort = ({ sortKey, customSort, sortOrder, sortId }: Sort) => {
    state.sortKey = sortKey
    state.customSort = customSort
    state.sortOrder = sortOrder
    state.sortId = sortId
  }

  const syncProp = <K extends keyof State>(key: K, reference: Ref, deep = false) => {
    watch(reference, () => {
      state[key] = reference.value
    }, { immediate: true, deep })
  }

  return {
    ...toRefs(state),
    filteredData,
    sortedData,
    tableState,
    totalItems,
    totalPages,
    selectRow,
    selectRows,
    deselectRow,
    deselectRows,
    selectAll,
    deselectAll,
    setSort,
    revealPage,
    revealItem,
    selectPage,
    nextPage,
    previousPage,
    firstPage,
    lastPage,
    syncProp
  }
}
