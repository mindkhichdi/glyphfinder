<template>
  <button
    class="glyph-item"
    data-focusable
    @keydown.enter="copyToClipboard"
    @dblclick="copyToClipboard"
  >
    {{ glyph.symbol }}
  </button>
</template>

<script>
import copy from 'copy-to-clipboard'

export default {
  props: {
    glyph: {
      required: true,
      type: Object,
    },
  },

  methods: {
    copyToClipboard() {
      const copied = copy(this.glyph.symbol)
      if (copied) {
        console.log('copied', this.glyph)
      } else {
        console.log('copy failed')
      }
    },
  },
}
</script>

<style lang="scss" src="./style.scss" scoped></style>
