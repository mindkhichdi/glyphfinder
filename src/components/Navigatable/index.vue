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
      selectedIndex: 0,
    }
  },

  computed: {
    selectedGlyph() {
      if ((this.glyphs.length - 1) < this.selectedIndex) {
        return null
      }

      return this.glyphs[this.selectedIndex]
    },
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
        this.selectedIndex = 0
      },
    },
  },

  methods: {
    handleKeyDown(event) {
      const { key } = event

      if (key.startsWith('Arrow')) {
        event.preventDefault()
      }

      if (key === 'ArrowDown') {
        this.changeIndex(5)
      } else if (key === 'ArrowUp') {
        this.changeIndex(-5)
      } else if (key === 'ArrowRight') {
        this.changeIndex(1)
      } else if (key === 'ArrowLeft') {
        this.changeIndex(-1)
      }
    },

    changeIndex(change = 0) {
      const min = 0
      const max = this.glyphs.length - 1
      const newIndex = Math.min(Math.max(parseInt(this.selectedIndex + change, 10), min), max)

      this.selectedIndex = newIndex
    },
  },

  mounted() {
    document.addEventListener('keydown', this.handleKeyDown)
  },

  beforeDestroy() {
    document.removeEventListener('keydown', this.handleKeyDown)
  },

  render() {
    return this.$scopedSlots.default()
  },
}
</script>
