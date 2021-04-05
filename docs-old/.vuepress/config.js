module.exports = {
  title: 'VueJs Smart Table',
  base: '/vuejs-smart-table/',
  description: 'Simple yet powerful Data Table for Vue',
  configurewebpack: {
    resolve: {
      alias: {
        'vue-smart-table': '../../src'
      }
    }
  },
  themeConfig: {
    repo: 'tochoromero/vuejs-smart-table',
    docsDir: 'docs',
    editLinks: true,
    sidebarDepth: 1,
    sidebar: [
      '/',
      'the-basics/',
      'filtering/',
      'sorting/',
      'pagination/',
      'selection/'
    ]
  }
}
