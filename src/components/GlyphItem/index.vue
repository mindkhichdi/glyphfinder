<template>
  <button
    class="glyph-item"
    :class="{
      'is-active': isSelected,
      'is-emoji': isEmoji,
      'is-space': isSpace,
    }"
    type="button"
    @click="handleClick"
    @dblclick="copyToClipboard"
    :title="glyph.name"
  >
    <span class="glyph-item__symbol">{{ glyph.symbol }}</span>
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

    isSpace() {
      return !/[^\s]/.test(this.glyph.symbol)
        && this.glyph.code !== 5760
        && this.glyph.code !== '5760'
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
      if (!this.isSelected) {
        return
      }

      if (
        event.key === 'Enter'
        || (this.isMac && event.key === 'c' && event.metaKey)
        || (this.isWindows && event.key === 'c' && event.ctrlKey)
      ) {
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
