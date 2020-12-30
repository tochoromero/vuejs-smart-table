import base from './rollup.config.base'

const config = Object.assign({}, base, {
  output: {
    exports: 'named',
    name: 'vue-smart-table',
    file: 'dist/vue-smart-table.umd.js',
    format: 'umd',
  },
})

export default config
