import base from './rollup.config.base'

const config = Object.assign({}, base, {
  output: {
    name: 'vue-smart-table',
    file: 'dist/vue-smart-table.esm.js',
    format: 'es'
  },
  external: [
    '@vue/composition-api'
  ]
})

export default config
