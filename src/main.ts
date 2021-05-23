import VTable from './VTable'
import VTh from './VTh'
import VTr from './VTr'
import VTPagination from './VTPagination'
import { install } from 'vue-demi'

install()

export default {
  install (app: any) {
    app.component('VTable', VTable)
    app.component('VTh', VTh)
    app.component('VTr', VTr)
    app.component('VTPagination', VTPagination)
  }
}
