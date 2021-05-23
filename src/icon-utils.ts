import { h } from 'vue-demi'

export function createIcon(props: { vbWidth: number, vbHeight: number, d: string, disabled?: boolean }) {
  const svgAttrs = {
    width: 16,
    height: 16,
    xmlns: 'http://www.w3.org/2000/svg',
    viewBox: `0 0 ${ props.vbWidth } ${ props.vbHeight }`
  }

  const pathAttrs = {
    fill: 'currentColor',
    d: props.d
  }

  return h('svg', {
      attrs: svgAttrs,
      ...svgAttrs,
      style: {
        ...(props.disabled ? { color: '#9CA3AF'}: {})
      }
    },
    h('path', {
      attrs: pathAttrs,
      ...pathAttrs
    }))
}
