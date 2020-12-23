import VTable from './VTable.vue'
import VTh from './VTh.vue'
import VTr from './VTr.vue'
import SmartPagination from './SmartPagination.vue'

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
