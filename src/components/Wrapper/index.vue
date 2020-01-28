<template>
  <navigatable :glyphs="glyphs" v-slot="{ rows, selectedGlyph }">
    <div class="wrapper">
      <div class="wrapper__header">
        <input
          class="wrapper__search"
          ref="search"
          type="text"
          placeholder="Search …"
          autofocus
          v-model="query"
          @blur="onBlurInput"
        >
      </div>
      <div class="wrapper__content">
        <glyph-list :rows="rows" />
      </div>
      <glyph-data
        class="wrapper__overlay"
        :glyph="selectedGlyph"
        v-if="selectedGlyph"
      />
    </div>
  </navigatable>
</template>

<script>
import GlyphList from '@/components/GlyphList'
import GlyphData from '@/components/GlyphData'
import Navigatable from '@/components/Navigatable'
import Glyphs from '@/services/Glyphs'

export default {
  components: {
    GlyphList,
    GlyphData,
    Navigatable,
  },

  data() {
    return {
      query: null,
    }
  },

  computed: {
    glyphs() {
      return Glyphs.search(this.query)
    },
  },

  methods: {
    onBlurInput() {
      this.$nextTick(() => {
        if (this.$refs.search) {
          this.$refs.search.focus()
        }
      })
    },
  },
}
</script>

<style lang="scss" src="./fonts.scss"></style>
<style lang="scss" src="./base.scss"></style>
<style lang="scss" src="./style.scss" scoped></style>
