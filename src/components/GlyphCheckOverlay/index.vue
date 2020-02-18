<template>
  <div class="preferences-overlay">
    glyphcheck

    <btn icon="close" @click.native="close" />

    {{ progress }} %
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
      .onFinish(() => {
        this.close()
      })
      .create()
  },
}
</script>

<style lang="scss" src="./style.scss" scoped></style>
