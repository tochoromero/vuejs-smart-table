import VTable from './VTable'
import VTh from './VTh'
import VTr from './VTr'
import SmartPagination from './SmartPagination'

export {
  VTable,
  VTh,
  VTr,
  SmartPagination
}
/**/
export default {
  install (Vue) {
    Vue.component('v-table', VTable)
    Vue.component('v-th', VTh)
    Vue.component('v-tr', VTr)
    Vue.component('smart-pagination', SmartPagination)
  }
}
