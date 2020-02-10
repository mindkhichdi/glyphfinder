<template>
  <navigatable
    :glyphs="glyphs"
    :is-search="isSearch"
    v-slot="{ rows, selectedGlyph }"
  >
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
import { ipcRenderer } from 'electron'
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

    isSearch() {
      return this.query ? !!this.query.length : false
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

    showPreferences() {
      console.log('showPreferences')
    },
  },

  mounted() {
    ipcRenderer.on('showPreferences', this.showPreferences)
  },

  beforeDestroy() {
    ipcRenderer.removeListener('showPreferences', this.showPreferences)
  },
}
</script>

<style lang="scss" src="./fonts.scss"></style>
<style lang="scss" src="./base.scss"></style>
<style lang="scss" src="./style.scss" scoped></style>
