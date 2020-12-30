import VTable from './VTable.vue'
import VTh from './VTh.vue'
import VTr from './VTr.vue'
import SmartPagination from './VTPagination.vue'

export {
  VTable,
  VTh,
  VTr,
  SmartPagination
}
/**/
export default {
  install (app: any) {
    app.component('VTable', VTable)
    app.component('VTh', VTh)
    app.component('VTr', VTr)
    app.component('VTPagination', SmartPagination)
  }
}
