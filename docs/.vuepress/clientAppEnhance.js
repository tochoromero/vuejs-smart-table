import Basics from '../components/Basics.vue'
import BasicFiltering from '../components/BasicFiltering.vue'
import CustomFiltering from '../components/CustomFiltering.vue'
import Sorting from '../components/Sorting.vue'
import Selection from '../components/Selection.vue'
import AdvancedSelection from '../components/AdvancedSelection.vue'
import Pagination from '../components/Pagination.vue'
import VTable from '../../src/VTable'
import VTh from '../../src/VTh'
import VTr from '../../src/VTr'
import VTPagination from '../../src/VTPagination'

import { defineClientAppEnhance } from '@vuepress/client'

export default defineClientAppEnhance(({ app, router, siteData }) => {
  app.component('VTable', VTable)
  app.component('VTh', VTh)
  app.component('VTr', VTr)
  app.component('VTPagination', VTPagination)
  app.component('Basics', Basics)
  app.component('BasicFiltering', BasicFiltering)
  app.component('CustomFiltering', CustomFiltering)
  app.component('Sorting', Sorting)
  app.component('Selection', Selection)
  app.component('AdvancedSelection', AdvancedSelection)
  app.component('Pagination', Pagination)
})
