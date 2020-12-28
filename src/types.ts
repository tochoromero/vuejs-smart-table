export interface BasicFilter {
  value?: string | null;
  keys: string[];
  exact: boolean;
}

export interface CustomFilter {
  custom: (value: unknown, row: Record<string, unknown>) => boolean;
  value?: unknown;
}

export type Filters = Record<string, BasicFilter | CustomFilter>

export type SelectionMode = 'single' | 'multiple'

export type SortKey = string | ((obj: any, sortOrder: number) => any) | null;
export type CustomSort = ((a: any, b: any, sortOrder: number) => number) | null;
