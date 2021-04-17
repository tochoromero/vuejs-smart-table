<template>
  <nav
    v-show="!(hideSinglePage && totalPages === 1)"
    class="smart-pagination"
  >
    <ul class="pagination">
      <li
        v-if="boundaryLinks"
        :class="{'disabled': currentPage === 1}"
        class="page-item"
      >
        <a
          href="javascript:void(0)"
          aria-label="Previous"
          class="page-link"
          @click="firstPage"
        >
          <span aria-hidden="true">
            {{ firstText }}
          </span>
        </a>
      </li>

      <li
        v-if="directionLinks"
        :class="{'disabled': currentPage === 1}"
        class="page-item"
      >
        <a
          href="javascript:void(0)"
          aria-label="Previous"
          class="page-link"
          @click="previousPage()"
        >
          <slot
            name="previousIcon"
            :disabled="currentPage === 1"
          >
            <svg
              width="16"
              height="16"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 320 512"
            >
              <path
                fill="currentColor"
                d="M34.52 239.03L228.87 44.69c9.37-9.37 24.57-9.37 33.94 0l22.67 22.67c9.36 9.36 9.37 24.52.04 33.9L131.49 256l154.02 154.75c9.34 9.38 9.32 24.54-.04 33.9l-22.67 22.67c-9.37 9.37-24.57 9.37-33.94 0L34.52 272.97c-9.37-9.37-9.37-24.57 0-33.94z"
              />
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
        <a
          href="javascript:void(0)"
          class="page-link"
          @click="selectPage(page.value)"
        >{{ page.title }}</a>
      </li>

      <li
        v-if="directionLinks"
        :class="{'disabled': currentPage === totalPages}"
        class="page-item"
      >
        <a
          href="javascript:void(0)"
          aria-label="Next"
          class="page-link"
          @click="nextPage()"
        >
          <slot
            name="nextIcon"
            :disabled="currentPage === totalPages"
          >
            <svg
              width="16"
              height="16"
              role="img"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 320 512"
            >
              <path
                fill="currentColor"
                d="M285.476 272.971L91.132 467.314c-9.373 9.373-24.569 9.373-33.941 0l-22.667-22.667c-9.357-9.357-9.375-24.522-.04-33.901L188.505 256 34.484 101.255c-9.335-9.379-9.317-24.544.04-33.901l22.667-22.667c9.373-9.373 24.569-9.373 33.941 0L285.475 239.03c9.373 9.372 9.373 24.568.001 33.941z"
              />
            </svg>
          </slot>
        </a>
      </li>

      <li
        v-if="boundaryLinks"
        :class="{'disabled': currentPage === totalPages}"
        class="page-item"
      >
        <a
          href="javascript:void(0)"
          aria-label="Previous"
          class="page-link"
          @click="lastPage()"
        >
          <span aria-hidden="true">
            {{ lastText }}
          </span>
        </a>
      </li>
    </ul>
  </nav>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue-demi'
import { useStore } from './use-store'

export default defineComponent({
  name: 'VTPagination',
  props: {
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
  setup (props) {
    const {
      totalPages,
      currentPage,
      selectPage,
      nextPage,
      previousPage,
      firstPage,
      lastPage
    } = useStore()

    const getAllPages = () => {
      const allPages = []

      for (let i = 1; i <= totalPages.value; i++) {
        allPages.push({
          title: i.toString(),
          value: i
        })
      }
      return allPages
    }

    const getLimitedPages = () => {
      const displayPages = []
      const totalTiers = Math.ceil(totalPages.value / props.maxPageLinks)
      const activeTier = Math.ceil(((currentPage && currentPage.value) || 1) / props.maxPageLinks)

      const start = ((activeTier - 1) * props.maxPageLinks) + 1
      const end = start + props.maxPageLinks

      if (activeTier > 1) {
        displayPages.push({
          title: '...',
          value: start - 1
        })
      }

      for (let i = start; i < end; i++) {
        if (i > totalPages.value) {
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

    return {
      displayPages,
      currentPage,
      selectPage,
      nextPage,
      previousPage,
      firstPage,
      lastPage,
      totalPages
    }
  }
})
</script>

<style>
  .disabled svg {
    color: grey;
  }

  .disabled a {
    cursor: not-allowed
  }
</style>
