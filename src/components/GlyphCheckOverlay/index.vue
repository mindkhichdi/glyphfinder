<template>
  <div class="glyph-check-overlay">
    generating glyphs {{ progress }} %
    <floating-glyphs class="glyph-check-overlay__glyphs" />
  </div>
</template>

<script>
import FloatingGlyphs from '@/components/FloatingGlyphs'
import Event from '@/services/Event'
import GlyphIndex from '@/services/GlyphIndex'

export default {
  components: {
    FloatingGlyphs,
  },

  data() {
    return {
      progress: 0,
    }
  },

  methods: {
    close() {
      Event.emit('hideGlyphCheck')
    },
  },

  mounted() {
    GlyphIndex
      .onProgress(progress => {
        this.progress = progress
      })
      .onFinish(data => {
        Event.emit('glyphIndexCreated', data)
        this.close()
      })
      .create()
  },
}
</script>

<style lang="scss" src="./style.scss" scoped></style>
