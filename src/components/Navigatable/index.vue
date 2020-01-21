<script>
export default {
  props: {
    glyphs: {
      type: Array,
      default: () => ([]),
    },
  },

  data() {
    return {
      selectedGlyph: null,
    }
  },

  provide() {
    const navigatable = {}

    Object.defineProperty(navigatable, 'selectedGlyph', {
      enumerable: true,
      get: () => this.selectedGlyph,
    })

    return { navigatable }
  },

  watch: {
    glyphs: {
      immediate: true,
      handler() {
        if (!this.glyphs.length) {
          return
        }

        const [firstGlyph] = this.glyphs

        this.selectedGlyph = firstGlyph
      },
    },
  },

  render() {
    return this.$scopedSlots.default()
  },
}
</script>
