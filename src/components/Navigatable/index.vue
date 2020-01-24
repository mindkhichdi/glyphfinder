<script>
export default {
  props: {
    glyphs: {
      type: Array,
      default: () => ([]),
    },
  },

  data() {
    const showRows = 7

    return {
      selectedIndex: 0,
      startRow: 0,
      showRows,
      itemsPerRow: 5,
      rowHeight: 62,
      firstFullyVisibleRow: 0,
      lastFullyVisibleRow: showRows - 1,
    }
  },

  computed: {
    selectedGlyph() {
      if ((this.glyphs.length - 1) < this.selectedIndex) {
        return null
      }

      return this.glyphs[this.selectedIndex]
    },

    selectedRow() {
      return Math.floor(this.selectedIndex / this.itemsPerRow)
    },
  },

  provide() {
    const navigatable = {
      selectGlyph: this.selectGlyph,
      handleScroll: this.handleScroll,
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

    Object.defineProperty(navigatable, 'rowHeight', {
      enumerable: true,
      get: () => this.rowHeight,
    })

    return { navigatable }
  },

  watch: {
    glyphs: {
      immediate: true,
      handler() {
        this.selectedIndex = 0
        this.startRow = 0
      },
    },
  },

  methods: {
    handleScroll(data) {
      this.firstFullyVisibleRow = Math.ceil(data.offset / this.rowHeight)

      const firstVisibleRow = Math.floor(data.offset / this.rowHeight)
      const scrolledOverFirstRow = data.offset - firstVisibleRow * this.rowHeight

      this.lastFullyVisibleRow = this.firstFullyVisibleRow
        + this.showRows
        - (scrolledOverFirstRow > 0 ? 2 : 1)
    },

    maybeUpdateStartRow() {
      if (this.selectedRow < this.firstFullyVisibleRow) {
        this.startRow = Math.max(this.startRow - this.showRows, 0)
      }

      if (this.selectedRow > this.lastFullyVisibleRow) {
        this.startRow = this.selectedRow
      }
    },

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
      this.maybeUpdateStartRow()
    },
  },

  mounted() {
    document.addEventListener('keydown', this.handleKeyDown)
  },

  beforeDestroy() {
    document.removeEventListener('keydown', this.handleKeyDown)
  },

  render() {
    return this.$scopedSlots.default({
      selectedGlyph: this.selectedGlyph,
    })
  },
}
</script>
