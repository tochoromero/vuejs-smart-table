import Basics from '../components/Basics.vue'
import BasicFiltering from '../components/BasicFiltering.vue'
import CustomFiltering from '../components/CustomFiltering.vue'
import Sorting from '../components/Sorting.vue'
import VTable from '../../src/VTable'
import VTh from '../../src/VTh'

import { defineClientAppEnhance } from '@vuepress/client'

export default defineClientAppEnhance(({ app, router, siteData }) => {
  app.component('VTable', VTable)
  app.component('VTh', VTh)
  app.component('Basics', Basics)
  app.component('BasicFiltering', BasicFiltering)
  app.component('CustomFiltering', CustomFiltering)
  app.component('Sorting', Sorting)
})
