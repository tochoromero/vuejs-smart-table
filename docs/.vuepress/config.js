module.exports = {
  lang: 'en-US',
  title: 'Vue Smart Table',
  description: 'Simple and feature packed table components',
  themeConfig: {
    navbar: [
      {
        text: 'Documentation',
        link: '/getting-started.md'
      },
      {
        text: 'Migration Guide',
        link: '/migration-guide.md'
      },
      {
        text: 'Github',
        link: 'https://github.com/tochoromero/vuejs-smart-table/tree/next'
      }
    ],
    sidebar: [
      {
        isGroup: true,
        text: 'Documentation',
        children: [
          '/getting-started.md',
          '/the-basics.md',
          '/filtering.md',
          '/sorting.md',
          '/selection.md',
          '/pagination.md',
          '/table-state.md',
          '/migration-guide.md'
        ],
      },
    ]
  }
}
