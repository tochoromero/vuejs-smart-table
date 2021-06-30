import { computed, defineComponent, h, VNode } from 'vue-demi'
import { createIcon } from './icon-utils'

interface Page {
  title: String,
  value: number
}

export default defineComponent({
  name: 'VTPagination',
  props: {
    currentPage: {
      type: Number,
      required: true
    },
    totalPages: {
      type: Number,
      required: true
    },
    hideSinglePage: {
      required: false,
      type: Boolean,
      default: true
    },
    maxPageLinks: {
      required: false,
      type: Number,
      default: NaN
    },
    boundaryLinks: {
      required: false,
      type: Boolean,
      default: false
    },
    directionLinks: {
      required: false,
      type: Boolean,
      default: true
    }
  },
  setup(props, { slots, emit }) {
    const getAllPages = (): Page[] => {
      const allPages = []

      for (let i = 1; i <= props.totalPages; i++) {
        allPages.push({
          title: i.toString(),
          value: i
        })
      }
      return allPages
    }

    const getLimitedPages = (): Page[] => {
      const displayPages = []
      const totalTiers = Math.ceil(props.totalPages / props.maxPageLinks)
      const activeTier = Math.ceil((props.currentPage || 1) / props.maxPageLinks)

      const start = ((activeTier - 1) * props.maxPageLinks) + 1
      const end = start + props.maxPageLinks

      if (activeTier > 1) {
        displayPages.push({
          title: '...',
          value: start - 1
        })
      }

      for (let i = start; i < end; i++) {
        if (i > props.totalPages) {
          break
        }

        displayPages.push({
          title: i.toString(),
          value: i
        })
      }

      if (activeTier < totalTiers) {
        displayPages.push({
          title: '...',
          value: end
        })
      }

      return displayPages
    }

    const displayPages = computed(() => {
      if (isNaN(props.maxPageLinks) || props.maxPageLinks <= 0) {
        return getAllPages()
      } else {
        return getLimitedPages()
      }
    })

    const selectPage = (page: number) => {
      if (page < 1 || page > props.totalPages || page === props.currentPage) {
        return
      }
      emit('update:currentPage', page)
    }

    const nextPage = () => {
      if (!props.currentPage) {
        emit('update:currentPage', 1)
      } else if (props.currentPage < props.totalPages) {
        emit('update:currentPage', props.currentPage + 1)
      }
    }

    const previousPage = () => {
      if (!props.currentPage) {
        emit('update:currentPage', 1)
      } else if (props.currentPage > 1) {
        emit('update:currentPage', props.currentPage - 1)
      }
    }

    const firstPage = () => {
      emit('update:currentPage', 1)
    }

    const lastPage = () => {
      emit('update:currentPage',props.totalPages)
    }

    const creteListItem = (children: any | VNode, onClick: () => void, disabled: boolean, active = false) => {
      return h('li', {
          class: ['page-item', { disabled, active }]
        },
        [h('a', {
            class: 'page-link',
            style: {
              ...(disabled ? { cursor: 'not-allowed' } : {})
            },
            attributes: {
              href: 'javascript:void(0)'
            },
            href: 'javascript:void(0)',
            ...(disabled ? {} : { onClick }),
            on: {
              ...(disabled ? {} : { click: onClick })
            }
          },
          [children])]
      )
    }

    return () => {
      if (props.hideSinglePage && props.totalPages === 1) {
        return h('')
      }

      const listItems = []

      if (props.boundaryLinks) {
        const firstPageIcon = createIcon({
          vbWidth: 512,
          vbHeight: 512,
          d: 'M34.5 239L228.9 44.7c9.4-9.4 24.6-9.4 33.9 0l22.7 22.7c9.4 9.4 9.4 24.5 0 33.9L131.5 256l154 154.7c9.3 9.4 9.3 24.5 0 33.9l-22.7 22.7c-9.4 9.4-24.6 9.4-33.9 0L34.5 273c-9.3-9.4-9.3-24.6 0-34zm192 34l194.3 194.3c9.4 9.4 24.6 9.4 33.9 0l22.7-22.7c9.4-9.4 9.4-24.5 0-33.9L323.5 256l154-154.7c9.3-9.4 9.3-24.5 0-33.9l-22.7-22.7c-9.4-9.4-24.6-9.4-33.9 0L226.5 239c-9.3 9.4-9.3 24.6 0 34z'
        })

        const disabled = props.currentPage === 1
        const firstPageSlot = slots.firstPage?.({ disabled }) ?? firstPageIcon
        listItems.push(creteListItem(firstPageSlot, firstPage, disabled))
      }

      if (props.directionLinks) {
        const previousIcon = createIcon({
          vbWidth: 320,
          vbHeight: 512,
          d: 'M34.52 239.03L228.87 44.69c9.37-9.37 24.57-9.37 33.94 0l22.67 22.67c9.36 9.36 9.37 24.52.04 33.9L131.49 256l154.02 154.75c9.34 9.38 9.32 24.54-.04 33.9l-22.67 22.67c-9.37 9.37-24.57 9.37-33.94 0L34.52 272.97c-9.37-9.37-9.37-24.57 0-33.94z'
        })

        const disabled = props.currentPage === 1
        const previousSlot = slots.previous?.({ disabled }) ?? previousIcon
        listItems.push(creteListItem(previousSlot, previousPage, disabled))
      }

      for (const page of displayPages.value) {
        listItems.push(creteListItem(page.title, () => selectPage(page.value), false, page.value === props.currentPage))
      }

      if (props.directionLinks) {
        const nextIcon = createIcon({
          vbWidth: 320,
          vbHeight: 512,
          d: 'M285.476 272.971L91.132 467.314c-9.373 9.373-24.569 9.373-33.941 0l-22.667-22.667c-9.357-9.357-9.375-24.522-.04-33.901L188.505 256 34.484 101.255c-9.335-9.379-9.317-24.544.04-33.901l22.667-22.667c9.373-9.373 24.569-9.373 33.941 0L285.475 239.03c9.373 9.372 9.373 24.568.001 33.941z'
        })

        const disabled = props.currentPage === props.totalPages
        const nextSlot = slots.next?.({ disabled }) ?? nextIcon
        listItems.push(creteListItem(nextSlot, nextPage, disabled))
      }

      if (props.boundaryLinks) {
        const lastPageIcon = createIcon({
          vbWidth: 512,
          vbHeight: 512,
          d: 'M477.5 273L283.1 467.3c-9.4 9.4-24.6 9.4-33.9 0l-22.7-22.7c-9.4-9.4-9.4-24.5 0-33.9l154-154.7-154-154.7c-9.3-9.4-9.3-24.5 0-33.9l22.7-22.7c9.4-9.4 24.6-9.4 33.9 0L477.5 239c9.3 9.4 9.3 24.6 0 34zm-192-34L91.1 44.7c-9.4-9.4-24.6-9.4-33.9 0L34.5 67.4c-9.4 9.4-9.4 24.5 0 33.9l154 154.7-154 154.7c-9.3 9.4-9.3 24.5 0 33.9l22.7 22.7c9.4 9.4 24.6 9.4 33.9 0L285.5 273c9.3-9.4 9.3-24.6 0-34z'
        })

        const disabled = props.currentPage === props.totalPages
        const firstPageSlot = slots.lastPage?.({ disabled }) ?? lastPageIcon
        listItems.push(creteListItem(firstPageSlot, lastPage, disabled))
      }

      return h('nav', { class: 'vt-pagination' }, [
        h('ul', { class: 'pagination' }, [listItems])
      ])
    }
  }
})
