import { h } from 'vue-demi'
import { SortOrder } from './types'

export function createIcon(props: { vbWidth: number, vbHeight: number, d: string, opacity?: number, disabled?: boolean }) {
  const svgAttrs = {
    width: 16,
    height: 16,
    xmlns: 'http://www.w3.org/2000/svg',
    viewBox: `0 0 ${ props.vbWidth } ${ props.vbHeight }`
  }

  const pathAttrs = {
    fill: 'currentColor',
    d: props.d,
    opacity: props.opacity ?? 1
  }

  return h('svg', {
      attrs: svgAttrs,
      ...svgAttrs,
      style: {
        ...(props.disabled ? { color: '#9CA3AF'}: {})
      }
    },
    [h('path', {
      attrs: pathAttrs,
      ...pathAttrs
    })])
}

export function createSortIcon(order: SortOrder) {
  const svgAttrs = {
    width: 16,
    height: 16,
    xmlns: 'http://www.w3.org/2000/svg',
    viewBox: `0 0 320 512`
  }

  const upAttrs = () => ({
    fill: 'currentColor',
    opacity: order === SortOrder.NONE ? 0.4 : (order === SortOrder.ASC ? 0.4 : 1),
    d: 'M41.05 288.05h238c21.4 0 32.1 25.9 17 41l-119 119a23.9 23.9 0 0 1-33.8.1l-.1-.1-119.1-119c-15.05-15.05-4.4-41 17-41z'
  })

  const downAttrs = () => ({
    fill: 'currentColor',
    opacity: order === SortOrder.NONE ? 0.4 : (order === SortOrder.DESC ? 0.4 : 1),
    d: 'M24.05 183.05l119.1-119A23.9 23.9 0 0 1 177 64a.94.94 0 0 1 .1.1l119 119c15.1 15.1 4.4 41-17 41h-238c-21.45-.05-32.1-25.95-17.05-41.05z'
  })

  return h('svg', {
      attrs: svgAttrs,
      ...svgAttrs
    },
    [h('g', [
      h('path', {
        attrs: upAttrs(),
        ...upAttrs()
      }),
      h('path', {
        attrs: downAttrs(),
        ...downAttrs()
      })
    ])])
}
