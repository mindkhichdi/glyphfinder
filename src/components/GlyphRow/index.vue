<template>
  <div class="glyph-row" :style="`height:${height}px`">
    <div class="glyph-row__title" :style="`height:${titleHeight}px`" v-if="title">
      {{ title }}
    </div>
    <glyph-item
      v-for="glyph in glyphs"
      :key="glyph.symbol"
      :glyph="glyph"
    />
  </div>
</template>

<script>
import GlyphItem from '@/components/GlyphItem'

export default {
  inject: ['navigatable'],

  components: {
    GlyphItem,
  },

  props: {
    glyphs: {
      type: Array,
      default: () => ([]),
    },

    title: {
      type: String,
      default: null,
    },
  },

  computed: {
    height() {
      return this.title
        ? this.navigatable.glyphRowWithTitleHeight
        : this.navigatable.glyphRowHeight
    },

    titleHeight() {
      return this.navigatable.glyphRowWithTitleHeight - this.navigatable.glyphRowHeight
    },
  },
}
</script>

<style lang="scss" src="./style.scss" scoped></style>
