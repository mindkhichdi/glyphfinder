<template>
  <div class="preferences-overlay">
    glyphcheck

    <btn icon="close" @click.native="close" />

    {{ progress }} %
  </div>
</template>

<script>
// import collect from 'collect.js'
import Btn from '@/components/Btn'
import Event from '@/services/Event'
import Store from '@/services/Store'
import GlyphSupport from '@/services/GlyphSupport'
import data from '../../data/data.json'

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

    filterGlyphs() {
      // const glyphs = collect(data).take(100).toArray()
      const glyphs = data
      const glyphsCount = glyphs.length
      const supportedGlyphs = []

      for (let index = 0, p = Promise.resolve(); index < glyphsCount; index += 1) {
        p = p
          .then(async () => new Promise(resolve => {
            const progress = Math.floor((100 / glyphsCount) * (index + 1))

            const callback = () => {
              this.progress = progress

              const glyph = glyphs[index]
              const supported = GlyphSupport.characterInFont(glyph.symbol)

              if (supported) {
                supportedGlyphs.push(glyph)
              }

              resolve()
            }

            if (progress > this.progress) {
              return setTimeout(callback, 0)
            }

            return callback()
          }))
          .then(() => {
            const isLastGlyph = index === glyphsCount - 1

            if (isLastGlyph) {
              Event.emit('supportedGlyphs', supportedGlyphs)
              Store.set('supportedGlyphs', supportedGlyphs)
              this.close()
            }
          })
      }
    },
  },

  mounted() {
    this.filterGlyphs()
  },
}
</script>

<style lang="scss" src="./style.scss" scoped></style>
