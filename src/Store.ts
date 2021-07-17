import { Sort, SortOrder, State, TableState } from './types'
import { computed, reactive, ComputedRef, watch, Ref } from 'vue-demi'
import { calculateTotalPages, doFilter, doPaginate, doSort } from './table-utils'

export class Store {
  public state: State = reactive({
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
    pageSize: undefined,
    sortIconPosition: 'after',
    sortHeaderClass: ''
  })

  private readonly emit: (event: string, payload: any) => void
  public filteredData: ComputedRef<any[]>
  public sortedData: ComputedRef<any[]>
  public totalItems: ComputedRef<number>
  public totalPages: ComputedRef<number>
  public paginationEnabled: ComputedRef<0 | number | undefined>
  public displayData: ComputedRef<any[]>
  public tableState: ComputedRef<TableState>

  constructor(emitFn: (event: string, payload: any) => void) {
    this.emit = emitFn

    this.filteredData = computed(() => {
      if (this.state.data.length === 0) {
        return []
      }

      if (Object.keys(this.state.filters).length === 0) {
        return this.state.data
      }

      return doFilter(this.state.data, this.state.filters)
    })

    this.sortedData = computed(() => {
      if ((this.state.sortKey || this.state.customSort) && this.state.sortOrder !== 0) {
        return doSort(this.filteredData.value, this.state.sortKey, this.state.customSort, this.state.sortOrder)
      }

      return this.filteredData.value
    })

    // ============ Pagination ============ //
    this.totalItems = computed(() => this.filteredData.value.length)

    this.totalPages = computed(() => {
      if (!this.state.pageSize) return 0

      return calculateTotalPages(this.totalItems.value, this.state.pageSize)
    })

    watch(this.totalPages, totalPages => {
      this.emit('totalPagesChanged', totalPages)
    }, { immediate: true })

    this.paginationEnabled = computed(() => this.state.pageSize)
    const needsPaginationReset = computed(() => this.paginationEnabled.value && this.state.currentPage > this.totalPages.value)
    watch(needsPaginationReset, needsReset => {
      if (needsReset && this.paginationEnabled.value) {
        this.state.currentPage = 1
        this.emit('update:currentPage', this.state.currentPage)
      }
    })
    // ============ Pagination ============ //

    this.displayData = computed(() => {
      if (this.paginationEnabled.value) {
        return doPaginate(this.sortedData.value, this.state.pageSize!, this.state.currentPage)
      }

      return this.sortedData.value
    })

    watch(this.displayData, data => {
      this.emit('totalItemsChanged', data.length)
    })

    this.tableState = computed<TableState>(() => ({
      rows: this.displayData.value,
      rowsPrePagination: this.sortedData.value,
      selectedRows: this.state.selectedRows
    }))

    watch(this.tableState, state => {
      this.emit('stateChanged', state)
    }, { immediate: true, deep: true })
  }

  // ============ Pagination ============ //
  revealItem(item: any | ((item: any) => boolean)) {
    if (!this.paginationEnabled.value) {
      return false
    }

    let index: number
    if (typeof item === 'function') {
      index = this.sortedData.value.findIndex(item)
    } else {
      index = this.sortedData.value.indexOf(item)
    }

    if (index === -1) {
      return false
    }

    this.emit('update:currentPage', Math.ceil((index + 1) / this.state.pageSize!))
    return true
  }

  // ============ Pagination ============ //

  // ============ Selection ============ //
  selectRow(row: any) {
    if (this.state.selectionMode === 'single') {
      this.state.selectedRows = [row]
      return
    }

    if (!this.state.selectedRows.includes(row)) {
      this.state.selectedRows.push(row)
    }
  }

  selectRows(rows: any[]) {
    for (const row of rows) {
      this.selectRow(row)
    }
  }

  deselectRow(row: any) {
    const index = this.state.selectedRows.indexOf(row)

    if (index > -1) {
      this.state.selectedRows.splice(index, 1)
    }
  }

  deselectRows(rows: any[]) {
    for (const row of rows) {
      this.deselectRow(row)
    }
  }

  selectAll() {
    if (this.state.selectionMode === 'single') {
      return
    }

    this.state.selectedRows = [...this.state.data]
  }

  deselectAll() {
    this.state.selectedRows = []
  }

  // ============ Selection ============ //

  // ============ Sorting ============ //
  setSort({ sortKey, customSort, sortOrder, sortId }: Sort) {
    this.state.sortKey = sortKey
    this.state.customSort = customSort
    this.state.sortOrder = sortOrder
    this.state.sortId = sortId
  }

  // ============ Sorting ============ //

  syncProp<K extends keyof State>(key: K, reference: Ref, deep = false) {
    watch(reference, () => {
      this.state[key] = reference.value
    }, { immediate: true, deep })
  }
}
