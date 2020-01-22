<template>
  <button
    class="glyph-item"
    :class="{
      'is-active': isSelected,
      'is-emoji': isEmoji,
    }"
    type="button"
    @click="handleClick"
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

    isEmoji() {
      return this.glyph.tags.includes('emoji')
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

    handleClick() {
      this.navigatable.selectGlyph(this.glyph)
    },

    handleKeyDown(event) {
      if (this.isSelected && event.key === 'Enter') {
        this.copyToClipboard()
      }
    },
  },

  mounted() {
    document.addEventListener('keydown', this.handleKeyDown)
  },

  beforeDestroy() {
    document.removeEventListener('keydown', this.handleKeyDown)
  },
}
</script>

<style lang="scss" src="./style.scss" scoped></style>
