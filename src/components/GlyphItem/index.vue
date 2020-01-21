<template>
  <button
    class="glyph-item"
    :class="{ 'is-active': isSelected }"
    type="button"
    @keydown.enter="copyToClipboard"
    @dblclick="copyToClipboard"
    :title="glyph.name"
  >
    {{ glyph.symbol }}
  </button>
</template>

<script>
import copy from 'copy-to-clipboard'

export default {
  inject: ['navigatable'],

  props: {
    glyph: {
      required: true,
      type: Object,
    },
  },

  computed: {
    isSelected() {
      return this.navigatable.selectedGlyph
        ? this.navigatable.selectedGlyph.symbol === this.glyph.symbol
        : false
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
