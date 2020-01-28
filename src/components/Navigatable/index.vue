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
    formattedGlyphs() {
      return this.glyphs.map(glyph => ({
        ...glyph,
        id: glyph.symbol,
      }))
    },

    frequentlyUsedGlyphs() {
      return collect(this.usage)
        .sortByDesc('count')
        .map(item => this.formattedGlyphs.find(glyph => glyph.symbol === item.symbol))
        .map(glyph => ({
          ...glyph,
          id: `frequently_used_${glyph.symbol}`,
        }))
        .take(10)
        .toArray()
    },

    hasFrequentlyUsedGlyphs() {
      return this.frequentlyUsedGlyphs.length
    },

    glyphRows() {
      return this.chunkGlyphs(this.formattedGlyphs)
    },

    frequentlyUsedGlyphRows() {
      return this.chunkGlyphs(this.frequentlyUsedGlyphs)
    },

    rows() {
      return [
        ...(this.hasFrequentlyUsedGlyphs ? [
          {
            title: 'Frequently used',
          },
          ...this.frequentlyUsedGlyphRows,
          {
            title: 'Glyphs',
          },
        ] : []),
        ...this.glyphRows,
      ]
    },

    selectedGlyph() {
      if ((this.formattedGlyphs.length - 1) < this.selectedIndex) {
        return null
      }

      return this.formattedGlyphs[this.selectedIndex]
    },

    selectedRow() {
      return Math.floor(this.selectedIndex / this.itemsPerRow)
    },

    visibleRows() {
      return this.showRows - (this.isExpanded ? 2 : 1)
    },
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
      this.selectedIndex = this.formattedGlyphs.findIndex(item => item.id === glyph.id)
    },

    handleKeyDown(event) {
      const { key } = event

      if (key.startsWith('Arrow')) {
        event.preventDefault()
      }

      if (key === 'ArrowDown') {
        this.changeIndex(this.itemsPerRow)
      } else if (key === 'ArrowUp') {
        this.changeIndex(-this.itemsPerRow)
      } else if (key === 'ArrowRight') {
        this.changeIndex(1)
      } else if (key === 'ArrowLeft') {
        this.changeIndex(-1)
      }
    },

    changeIndex(change = 0) {
      const min = 0
      const max = this.formattedGlyphs.length - 1
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

  provide() {
    const navigatable = {
      selectGlyph: this.selectGlyph,
      handleScroll: this.handleScroll,
      toggleExpand: this.toggleExpand,
    }

    Object.defineProperties(navigatable, {
      selectedGlyph: {
        enumerable: true,
        get: () => this.selectedGlyph,
      },
      startRow: {
        enumerable: true,
        get: () => this.startRow,
      },
      showRows: {
        enumerable: true,
        get: () => this.showRows,
      },
      itemsPerRow: {
        enumerable: true,
        get: () => this.itemsPerRow,
      },
      glyphRowHeight: {
        enumerable: true,
        get: () => this.glyphRowHeight,
      },
      titleRowHeight: {
        enumerable: true,
        get: () => this.titleRowHeight,
      },
      isExpanded: {
        enumerable: true,
        get: () => this.isExpanded,
      },
    })

    return { navigatable }
  },

  render() {
    return this.$scopedSlots.default({
      selectedGlyph: this.selectedGlyph,
      rows: this.rows,
    })
  },
}
</script>
