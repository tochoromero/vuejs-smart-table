import { BasicFilter, CustomFilter, Filters } from '@/types'

export function getPropertyValue (object: Record<string, any>, keyPath: string) {
  keyPath = keyPath.replace(/\[(\w+)\]/g, '.$1')
  keyPath = keyPath.replace(/^\./, '')
  const keys = keyPath.split('.')

  let copy: any = object

  for (const key of keys) {
    if (key in copy) {
      copy = copy[key]
    } else {
      return
    }
  }
  return copy
}

export function isNumeric (toCheck: any): boolean {
  return !Array.isArray(toCheck) && !isNaN(parseFloat(toCheck)) && isFinite(toCheck)
}

export function doSort (
  toSort: any[],
  sortKey: string | ((obj: any, sortOrder: number) => any) | null,
  customSort: ((a: any, b: any, sortOrder: number) => number) | null,
  sortOrder: number) {
  const local = [...toSort]

  return local.sort((a, b) => {
    if (typeof customSort === 'function') {
      return customSort(a, b, sortOrder) // TODO breaking change
    }

    let val1
    let val2

    if (!sortKey) {
      val1 = null
      val2 = null
    } else if (typeof sortKey === 'function') {
      val1 = sortKey(a, sortOrder)
      val2 = sortKey(b, sortOrder)
    } else {
      val1 = getPropertyValue(a, sortKey)
      val2 = getPropertyValue(b, sortKey)
    }

    if (val1 === null || val1 === undefined) val1 = ''
    if (val2 === null || val2 === undefined) val2 = ''

    if (isNumeric(val1) && isNumeric(val2)) {
      return (val1 - val2) * sortOrder
    }

    const str1 = val1.toString()
    const str2 = val2.toString()

    return str1.localeCompare(str2) * sortOrder
  })
}

export function isBasicFilter (filter?: any): filter is BasicFilter {
  return Array.isArray(filter.keys)
}

function isCustomFilter (filter: any): filter is CustomFilter {
  return filter && typeof filter.custom === 'function'
}

export function passFilter (item: Record<string, unknown>, filter: BasicFilter | CustomFilter) {
  if (isCustomFilter(filter) && !filter.custom(filter.value, item)) {
    return false
  }

  if (!isBasicFilter(filter) || filter.value === null || filter.value === undefined || filter.value.length === 0) {
    return true
  }

  for (const key of filter.keys) {
    const value = getPropertyValue(item, key)

    if (value !== null && value !== undefined) {
      const filterStrings = Array.isArray(filter.value) ? filter.value : [filter.value]

      for (const filterString of filterStrings) {
        if (filter.exact) {
          if (value.toString() === filterString.toString()) {
            return true
          }
        } else {
          if (value.toString().toLowerCase().includes(filterString.toString().toLowerCase())) {
            return true
          }
        }
      }
    }
  }
  return false
}

export function doFilter (toFilter: any[], filters: Filters) {
  const filteredData = []

  for (const item of toFilter) {
    let passed = true

    for (const filterName in Object.keys(filters)) {
      // eslint-disable-next-line no-prototype-builtins
      if (!filters.hasOwnProperty(filterName)) {
        continue
      }

      const filter: CustomFilter | BasicFilter = filters[filterName]

      if (!passFilter(item, filter)) {
        passed = false
        break
      }
    }

    if (passed) {
      filteredData.push(item)
    }
  }

  return filteredData
}

export function doPaginate (toPaginate: any[], pageSize: number, currentPage: number): any[] {
  if (toPaginate.length <= pageSize || pageSize <= 0 || currentPage <= 0) {
    return toPaginate
  }

  const start = (currentPage - 1) * pageSize
  const end = start + pageSize

  return [...toPaginate].slice(start, end)
}

export function calculateTotalPages (totalItems: number, pageSize: number): number {
  return totalItems <= pageSize ? 1 : Math.ceil(totalItems / pageSize)
}

export function uuid (): string {
  return '_' + Math.random().toString(36).substr(2, 9)
}
