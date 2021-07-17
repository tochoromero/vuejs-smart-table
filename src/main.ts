import VTable from './VTable'
import VTh from './VTh'
import VTr from './VTr'
import VTPagination from './VTPagination'
import { install } from 'vue-demi'
import { PluginOptions } from './types'

install()

export default {
  install (app: any, options: PluginOptions = {}) {
    const props: Array<keyof PluginOptions> = ['hideSortIcons', 'sortIconPosition', 'sortHeaderClass']

    props.forEach(it => {
      if (options.hasOwnProperty( it)) {
        VTable.props[it].default = options[it]
      }
    })

    app.component('VTable', VTable)
    app.component('VTh', VTh)
    app.component('VTr', VTr)
    app.component('VTPagination', VTPagination)
  }
}
