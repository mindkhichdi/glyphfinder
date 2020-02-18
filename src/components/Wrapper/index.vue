<template>
  <div class="wrapper">
    <div class="wrapper__content" :class="{ 'is-hidden': showPreferences }">
      <glyph-wrapper v-if="!showGlyphCheck" />
      <div class="wrapper__content-overlay" />
    </div>

    <transition name="options">
      <preferences-overlay class="wrapper__overlay" v-if="showPreferences" />
    </transition>

    <transition name="options">
      <glyph-check-overlay class="wrapper__overlay" v-if="showGlyphCheck" />
    </transition>
  </div>
</template>

<script>
import { ipcRenderer } from 'electron'
import Event from '@/services/Event'
import Glyphs from '@/services/Glyphs'
import GlyphIndex from '@/services/GlyphIndex'
import GlyphWrapper from '@/components/GlyphWrapper'
import PreferencesOverlay from '@/components/PreferencesOverlay'
import GlyphCheckOverlay from '@/components/GlyphCheckOverlay'

export default {
  components: {
    GlyphWrapper,
    PreferencesOverlay,
    GlyphCheckOverlay,
  },

  data() {
    const DB = GlyphIndex.getDB()
    const indexExists = !!DB

    if (indexExists) {
      const { glyphs, searchIndex } = DB

      Glyphs
        .importGlyphs(glyphs)
        .importIndex(searchIndex)
    }

    return {
      showPreferences: false,
      showGlyphCheck: !indexExists,
    }
  },

  methods: {
    onShowPreferences() {
      this.showPreferences = true
    },

    onHidePreferences() {
      this.showPreferences = false
    },

    onShowGlyphCheck() {
      this.showGlyphCheck = true
    },

    onHideGlyphCheck() {
      this.showGlyphCheck = false
    },
  },

  mounted() {
    console.timeEnd('mount')
    ipcRenderer.on('showPreferences', this.onShowPreferences)
    Event.on('hidePreferences', this.onHidePreferences)
    Event.on('hideGlyphCheck', this.onHideGlyphCheck)
  },

  beforeDestroy() {
    ipcRenderer.removeListener('showPreferences', this.onShowPreferences)
    Event.off('hidePreferences', this.onHidePreferences)
    Event.off('hideGlyphCheck', this.onHideGlyphCheck)
  },
}
</script>

<style lang="scss" src="./fonts.scss"></style>
<style lang="scss" src="./base.scss"></style>
<style lang="scss" src="./animations.scss"></style>
<style lang="scss" src="./style.scss" scoped></style>
