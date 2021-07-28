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
  selectOnClick: boolean
  selectedClass: string
  hideSortIcons: boolean
  sortIconPosition: 'before' | 'after'
  sortId: string | null
  sortKey: SortKey
  customSort: CustomSort
  sortOrder: SortOrder
  currentPage: number
  pageSize?: number
  sortHeaderClass: string
}

export interface PluginOptions {
  hideSortIcons?: boolean
  sortIconPosition?: 'before' | 'after',
  sortHeaderClass?: string,
  selectOnClick?: boolean
}

