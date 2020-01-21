<template>
  <div class="wrapper">
    <div class="wrapper__header">
      <input
        class="wrapper__search"
        type="text"
        autofocus
        v-model="query"
      >
    </div>
    <div class="wrapper__content">
      <glyph-list :glyphs="results" />
    </div>
  </div>
</template>

<script>
import GlyphList from '@/components/GlyphList'
import Glyphs from '@/services/Glyphs'

export default {
  components: {
    GlyphList,
  },

  data() {
    return {
      query: null,
    }
  },

  computed: {
    results() {
      console.log(Glyphs.items)
      return Glyphs.items
      // const glyphs = Glyphs.search(this.query)

      // console.log(Glyphs.getRows(glyphs, 5))

      // return glyphs
    },
  },
}
</script>

<style lang="scss" src="./fonts.scss"></style>
<style lang="scss" src="./base.scss"></style>
<style lang="scss" src="./style.scss" scoped></style>
