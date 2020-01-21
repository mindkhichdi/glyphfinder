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
      startRow: 0,
      showRows: 8,
      itemsPerRow: 5,
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
    const navigatable = {
      selectGlyph: this.selectGlyph,
    }

    Object.defineProperty(navigatable, 'selectedGlyph', {
      enumerable: true,
      get: () => this.selectedGlyph,
    })

    Object.defineProperty(navigatable, 'startRow', {
      enumerable: true,
      get: () => this.startRow,
    })

    Object.defineProperty(navigatable, 'showRows', {
      enumerable: true,
      get: () => this.showRows,
    })

    Object.defineProperty(navigatable, 'itemsPerRow', {
      enumerable: true,
      get: () => this.itemsPerRow,
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
    selectGlyph(glyph) {
      const index = this.glyphs.findIndex(item => item.symbol === glyph.symbol)

      this.selectedIndex = index
    },

    handleKeyDown(event) {
      const { key } = event

      if (key.startsWith('Arrow')) {
        event.preventDefault()
      }

      if (key === 'ArrowDown') {
        this.changeIndex(5)
        // this.startRow = this.startRow + 1
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
