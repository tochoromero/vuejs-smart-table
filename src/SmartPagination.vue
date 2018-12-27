<template replaceable part="pagination">
  <nav v-show="!(hideSinglePage && totalPages === 1)" class="smart-pagination">
    <ul class="pagination">
      <li :class="{'disabled': currentPage === 1}" v-if="boundaryLinks" class="page-item">
        <a href="javascript:void(0)" aria-label="Previous" @click="firstPage" class="page-link">
          <span aria-hidden="true" v-html="firstText"></span>
        </a>
      </li>

      <li :class="{'disabled': currentPage === 1}" v-if="directionLinks" class="page-item">
        <a href="javascript:void(0)" aria-label="Previous" @click="previousPage()" class="page-link">
          <slot name="previousIcon" :disabled="currentPage === 1">
            <svg width="16" height="16" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">
              <path fill="currentColor"
                    d="M34.52 239.03L228.87 44.69c9.37-9.37 24.57-9.37 33.94 0l22.67 22.67c9.36 9.36 9.37 24.52.04 33.9L131.49 256l154.02 154.75c9.34 9.38 9.32 24.54-.04 33.9l-22.67 22.67c-9.37 9.37-24.57 9.37-33.94 0L34.52 272.97c-9.37-9.37-9.37-24.57 0-33.94z"></path>
            </svg>
          </slot>
        </a>
      </li>

      <li
        v-for="page in displayPages"
        :key="page.value"
        class="page-item"
        :class="{'active': currentPage === page.value}"
      >
        <a href="javascript:void(0)" @click="selectPage(page.value)" class="page-link">{{page.title}}</a>
      </li>

      <li :class="{'disabled': currentPage === totalPages}" v-if="directionLinks"
          class="page-item">
        <a href="javascript:void(0)" aria-label="Next" @click="nextPage()" class="page-link">
          <slot name="nextIcon" :disabled="currentPage === totalPages">
            <svg width="16" height="16" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">
              <path fill="currentColor"
                    d="M285.476 272.971L91.132 467.314c-9.373 9.373-24.569 9.373-33.941 0l-22.667-22.667c-9.357-9.357-9.375-24.522-.04-33.901L188.505 256 34.484 101.255c-9.335-9.379-9.317-24.544.04-33.901l22.667-22.667c9.373-9.373 24.569-9.373 33.941 0L285.475 239.03c9.373 9.372 9.373 24.568.001 33.941z"></path>
            </svg>
          </slot>
        </a>
      </li>

      <li :class="{'disabled': currentPage === totalPages}" v-if="boundaryLinks"
          class="page-item">
        <a href="javascript:void(0)" aria-label="Previous" @click="lastPage()" class="page-link">
          <span aria-hidden="true" v-html="lastText"></span>
        </a>
      </li>
    </ul>
  </nav>
</template>

<script>
export default {
  name: 'SmartPagination',
  props: {
    currentPage: {
      required: true,
      type: Number
    },
    totalPages: {
      required: true,
      type: Number
    },
    hideSinglePage: {
      required: false,
      type: Boolean,
      default: true
    },
    maxPageLinks: {
      required: false,
      type: Number
    },
    boundaryLinks: {
      required: false,
      type: Boolean,
      default: false
    },
    firstText: {
      required: false,
      type: String,
      default: 'First'
    },
    lastText: {
      required: false,
      type: String,
      default: 'Last'
    },
    directionLinks: {
      required: false,
      type: Boolean,
      default: true
    }
  },
  computed: {
    displayPages () {
      if (isNaN(this.maxPageLinks) || this.maxPageLinks <= 0) {
        return this.displayAllPages()
      } else {
        return this.limitVisiblePages()
      }
    }
  },
  methods: {
    displayAllPages () {
      const displayPages = []

      for (let i = 1; i <= this.totalPages; i++) {
        displayPages.push({
          title: i.toString(),
          value: i
        })
      }
      return displayPages
    },
    limitVisiblePages () {
      const displayPages = []

      const totalTiers = Math.ceil(this.totalPages / this.maxPageLinks)

      const activeTier = Math.ceil(this.currentPage / this.maxPageLinks)

      const start = ((activeTier - 1) * this.maxPageLinks) + 1
      const end = start + this.maxPageLinks

      if (activeTier > 1) {
        displayPages.push({
          title: '...',
          value: start - 1
        })
      }

      for (let i = start; i < end; i++) {
        if (i > this.totalPages) {
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
    },
    selectPage (page) {
      if (page < 1 || page > this.totalPages || page === this.currentPage) {
        return
      }

      this.$emit('update:currentPage', page)
    },
    nextPage () {
      if (this.currentPage < this.totalPages) {
        this.$emit('update:currentPage', this.currentPage + 1)
      }
    },
    previousPage () {
      if (this.currentPage > 1) {
        this.$emit('update:currentPage', this.currentPage - 1)
      }
    },
    firstPage () {
      this.$emit('update:currentPage', 1)
    },
    lastPage () {
      this.$emit('update:currentPage', this.totalPages)
    }
  }
}
</script>

<style>
  .disabled svg {
    color: grey;
  }

  .disabled a {
    cursor: not-allowed
  }
</style>
