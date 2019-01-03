import { expect } from 'chai'
import { calculateTotalPages, isNumeric, getPropertyValue, doPaginate } from '../../src/table-utils.js'

let scenario = [
  { totalItems: 10, pageSize: 5, result: 2 },
  { totalItems: 1, pageSize: 10, result: 1 },
  { totalItems: 11, pageSize: 10, result: 2 },
  { totalItems: 200, pageSize: 200, result: 1 },
  { totalItems: 200, pageSize: 1, result: 200 }
]

scenario.forEach(({ totalItems, pageSize, result }) => {
  describe('calculateTotalPages', () => {
    it(`Should be ${result} pages when totalItems is ${totalItems} and pageSize: is ${pageSize}`, () => {
      expect(calculateTotalPages(totalItems, pageSize))
        .to.equal(result)
    })
  })
})

scenario = [
  { toCheck: 5, result: true },
  { toCheck: 1.0, result: true },
  { toCheck: -1.0, result: true },
  // eslint-disable-next-line no-floating-decimal
  { toCheck: .5, result: true },
  { toCheck: 0.8, result: true },
  { toCheck: '0.5', result: true },
  { toCheck: '-0.5', result: true },
  { toCheck: 'asd', result: false },
  { toCheck: '5,2', result: false },
  { toCheck: [1], result: false },
  { toCheck: [], result: false },
  { toCheck: { value: 1 }, result: false }
]

scenario.forEach(({ toCheck, result }) => {
  describe('isNumeric', () => {
    it(`${toCheck} should ${result ? '' : 'not'} be numeric`, () => {
      expect(isNumeric(toCheck))
        .to.equal(result)
    })
  })
})

scenario = [
  { object: { value: 'asd', values: 123 }, path: 'value', result: 'asd' },
  { object: { value: 'asd', values: 123 }, path: '[value]', result: 'asd' },
  { object: { a: { b: { c: 13 } } }, path: 'a.b.c', result: 13 },
  { object: { a: { b: { c: 13 } } }, path: 'a[b].c', result: 13 },
  { object: { value: 'asd' }, path: 'none', result: undefined },
  { object: {}, path: 'empty', result: undefined }
]

scenario.forEach(({ object, path, result }) => {
  describe('getPropertyValue', () => {
    it(`path '${path}' should be ${result}`, () => {
      expect(getPropertyValue(object, path))
        .to.equal(result)
    })
  })
})

let toPaginate = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
scenario = [
  { pageSize: 3, currentPage: 1, result: [1, 2, 3] },
  { pageSize: 5, currentPage: 2, result: [6, 7, 8, 9, 10] },
  { pageSize: 2, currentPage: 3, result: [5, 6] },
  { pageSize: 5, currentPage: 3, result: [] },
  { pageSize: 50, currentPage: 1, result: toPaginate },
  { pageSize: 0, currentPage: 1, result: toPaginate },
  { pageSize: 5, currentPage: 0, result: toPaginate }
]

scenario.forEach(({ pageSize, currentPage, result }) => {
  describe('doPaginate', () => {
    it(`With size: ${pageSize} and currentPage: ${currentPage} it should return ${result}`, () => {
      expect(doPaginate(toPaginate, pageSize, currentPage))
        .to.eql(result)
    })
  })
})
