<script>
import collect from 'collect.js'
import Store from '@/services/Store'

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
      glyphRowHeight: 62,
      titleRowHeight: 30,
      firstFullyVisibleRow: 0,
      lastFullyVisibleRow: 0,
      isExpanded: Store.get('expanded', false),
      usage: Store.get('usage', []),
      scrollPosition: {
        offset: 0,
      },
    }
  },

  computed: {
    frequentlyUsedGlyphs() {
      return collect(this.usage)
        .sortByDesc('count')
        .map(item => this.glyphs.find(glyph => glyph.symbol === item.symbol))
        .take(10)
        .toArray()
    },

    rows() {
      const allGlyphRows = this.chunkGlyphs(this.glyphs)
      const frequentlyUsedGlyphRows = this.chunkGlyphs(this.frequentlyUsedGlyphs)

      return [
        ...(this.frequentlyUsedGlyphs.length ? [
          {
            title: 'Frequently used',
          },
          ...frequentlyUsedGlyphRows,
          {
            title: 'Glyphs',
          },
        ] : []),
        ...allGlyphRows,
      ]
    },

    selectedGlyph() {
      if ((this.glyphs.length - 1) < this.selectedIndex) {
        return null
      }

      return this.glyphs[this.selectedIndex]
    },

    selectedRow() {
      return Math.floor(this.selectedIndex / this.itemsPerRow)
    },

    visibleRows() {
      return this.showRows - (this.isExpanded ? 2 : 1)
    },
  },

  provide() {
    const navigatable = {
      selectGlyph: this.selectGlyph,
      handleScroll: this.handleScroll,
      toggleExpand: this.toggleExpand,
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

    Object.defineProperty(navigatable, 'glyphRowHeight', {
      enumerable: true,
      get: () => this.glyphRowHeight,
    })

    Object.defineProperty(navigatable, 'titleRowHeight', {
      enumerable: true,
      get: () => this.titleRowHeight,
    })

    Object.defineProperty(navigatable, 'isExpanded', {
      enumerable: true,
      get: () => this.isExpanded,
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
    chunkGlyphs(glyphs) {
      return collect(glyphs)
        .chunk(this.itemsPerRow)
        .filter(items => items.toArray().length)
        .map(items => ({
          glyphs: items.toArray(),
        }))
        .toArray()
    },

    toggleExpand() {
      this.isExpanded = !this.isExpanded
      Store.set('expanded', this.isExpanded)
      this.updateVisibleRows()
    },

    handleScroll(scrollPosition) {
      this.scrollPosition = scrollPosition
      this.updateVisibleRows()
    },

    updateVisibleRows() {
      this.firstFullyVisibleRow = Math.ceil(this.scrollPosition.offset / this.glyphRowHeight)

      const firstVisibleRow = Math.floor(this.scrollPosition.offset / this.glyphRowHeight)
      const scrolledOverFirstRow = this.scrollPosition.offset
        - firstVisibleRow
        * this.glyphRowHeight

      this.lastFullyVisibleRow = this.firstFullyVisibleRow
        + this.visibleRows
        - (scrolledOverFirstRow > 0 ? 2 : 1)
    },

    maybeUpdateStartRow() {
      if (this.selectedRow < this.firstFullyVisibleRow) {
        this.startRow = Math.max(this.startRow - this.visibleRows, 0)
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
    this.updateVisibleRows()
    document.addEventListener('keydown', this.handleKeyDown)
  },

  beforeDestroy() {
    document.removeEventListener('keydown', this.handleKeyDown)
  },

  render() {
    return this.$scopedSlots.default({
      selectedGlyph: this.selectedGlyph,
      rows: this.rows,
    })
  },
}
</script>
