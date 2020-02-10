<template>
  <div class="glyph-wrapper">
    <div class="glyph-wrapper__header">
      <input
        class="glyph-wrapper__search"
        ref="search"
        type="text"
        placeholder="Search …"
        autofocus
        v-model="query"
        @blur="onBlurInput"
      >
    </div>
    <div class="glyph-wrapper__content">
      <glyph-list :rows="navigatable.rows" />
    </div>
    <glyph-data
      class="glyph-wrapper__overlay"
      :glyph="navigatable.selectedGlyph"
      v-if="navigatable.selectedGlyph"
    />
  </div>
</template>

<script>
import GlyphList from '@/components/GlyphList'
import GlyphData from '@/components/GlyphData'

export default {
  inject: ['navigatable'],

  components: {
    GlyphList,
    GlyphData,
  },

  data() {
    return {
      query: null,
    }
  },

  watch: {
    query(value) {
      this.navigatable.setQuery(value)
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

<style lang="scss" src="./style.scss" scoped></style>
