<template>
  <div class="preferences-overlay">
    generating glyphs {{ progress }} %
    <btn icon="close" @click.native="close" />
  </div>
</template>

<script>
import Btn from '@/components/Btn'
import Event from '@/services/Event'
import GlyphIndex from '@/services/GlyphIndex'

export default {
  components: {
    Btn,
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
