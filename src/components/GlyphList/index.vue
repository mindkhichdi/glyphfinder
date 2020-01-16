<template>
  <div class="glyph-list">
    <glyph-item v-for="glyph in glyphs" :key="glyph.symbol" :glyph="glyph" />
  </div>
</template>

<script>
import GlyphItem from '@/components/GlyphItem'

export default {
  components: {
    GlyphItem,
  },

  props: {
    glyphs: {
      type: Array,
      default: () => ([]),
    },
  },
}
</script>

<style>

</style>
