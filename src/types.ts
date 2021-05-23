import { Store } from './Store'

export interface TableState {
  rows: any[],
  rowsPrePagination: any[],
  selectedRows: any[]
}

export interface BasicFilter {
  value: string
  keys: string[]
  exact?: boolean
}

export interface CustomFilter {
  value?: any;
  custom: CustomFilterFunction;
}

export type CustomFilterFunction = (value: any, row: Record<string, any>) => boolean

export type Filters = Record<string, BasicFilter | CustomFilter>

export type SelectionMode = 'single' | 'multiple'

export type SortKey = string | ((obj: any, sortOrder: SortOrder) => any) | null;
export type CustomSort = ((a: any, b: any, sortOrder: SortOrder) => number) | null;
export enum SortOrder {
  DESC = -1,
  NONE = 0,
  ASC= 1
}

export interface Sort {
  sortId: string | null;
  sortKey: SortKey;
  customSort: CustomSort;
  sortOrder: number;
}

export interface State extends Sort {
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

export interface VTable {
  tableState: TableState,
  selectAll: () => void,
  deselectAll: () => void,
  selectRows: (rows: any[]) => void
  selectRow: (row: any) => void
  deselectRows: (rows: any[]) => void
  deselectRow: (row: any) => void
  revealItem: (item: any | ((item: any) => boolean)) => boolean
}

