<script>
import collect from 'collect.js'
import Store from '@/services/Store'

export default {
  props: {
    glyphs: {
      type: Array,
      default: () => ([]),
    },

    isSearch: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      selection: {
        x: 0,
        y: 0,
      },
      startRow: 0,
      showRows: 8,
      itemsPerRow: 5,
      glyphRowHeight: 62,
      glyphRowWithTitleHeight: 92,
      firstFullyVisibleRowIndex: 0,
      lastFullyVisibleRowIndex: 0,
      isExpanded: Store.get('expanded', false),
      usage: Store.get('usage', []),
      scrollPosition: {
        offset: 0,
      },
    }
  },

  computed: {
    isEmpty() {
      return this.glyphs.length === 0
    },

    formattedGlyphs() {
      return this.glyphs.map(glyph => ({
        ...glyph,
        id: glyph.symbol,
      }))
    },

    frequentlyUsedGlyphs() {
      if (this.isSearch) {
        return []
      }

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
        .map((row, index) => {
          if (index === 0 && !this.isSearch && this.hasFrequentlyUsedGlyphs) {
            return {
              title: 'Glyphs',
              ...row,
            }
          }

          return row
        })
    },

    frequentlyUsedGlyphRows() {
      return this.chunkGlyphs(this.frequentlyUsedGlyphs)
        .map((row, index) => {
          if (index === 0) {
            return {
              title: 'Frequently used',
              ...row,
            }
          }

          return row
        })
    },

    rows() {
      return [
        ...this.frequentlyUsedGlyphRows,
        ...this.glyphRows,
      ]
    },

    offsets() {
      const offsets = []
      let offset = 0

      this.rows.forEach((row, index) => {
        const size = row.title
          ? this.glyphRowWithTitleHeight
          : this.glyphRowHeight

        offsets.push({
          index,
          size,
          offset,
        })

        offset += size
      })

      return offsets
    },

    selectedGlyph() {
      if (this.isEmpty) {
        return null
      }

      const { x, y } = this.selection
      const row = this.rows[y]
      const glyph = row.glyphs[x]

      return glyph
    },
  },

  watch: {
    glyphs: {
      immediate: true,
      handler() {
        this.selection = {
          x: 0,
          y: 0,
        }

        this.updateVisibleRows()

        // force re-render to 0
        this.startRow = 1
        this.$nextTick(() => {
          this.startRow = 0
        })
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
      const containerHeight = 506 // TODO
      const visibleScrollHeight = containerHeight - (this.isExpanded ? 101 : 54)
      const firstFullyVisibleRow = collect(this.offsets)
        .filter(item => item.offset >= this.scrollPosition.offset)
        .first()

      if (firstFullyVisibleRow) {
        this.firstFullyVisibleRowIndex = firstFullyVisibleRow.index
      }

      const lastFullyVisibleRow = collect(this.offsets)
        .filter(item => item.offset <= (this.scrollPosition.offset + visibleScrollHeight))
        .last()

      if (lastFullyVisibleRow) {
        this.lastFullyVisibleRowIndex = lastFullyVisibleRow.index - 1
      }
    },

    maybeUpdateStartRow() {
      const { y } = this.selection

      if (y < this.firstFullyVisibleRowIndex) {
        this.startRow = Math.max(this.firstFullyVisibleRowIndex - 1, 0)
      }

      if (y > this.lastFullyVisibleRowIndex) {
        this.startRow = y
      }
    },

    setSelection(x, y) {
      this.selection = {
        x,
        y,
      }
    },

    handleKeyDown(event) {
      const { key } = event

      if (key.startsWith('Arrow')) {
        event.preventDefault()
      }

      if (key === 'ArrowDown') {
        this.moveSelection('down')
      } else if (key === 'ArrowUp') {
        this.moveSelection('up')
      } else if (key === 'ArrowRight') {
        this.moveSelection('right')
      } else if (key === 'ArrowLeft') {
        this.moveSelection('left')
      }
    },

    moveSelection(direction) {
      const { x, y } = this.selection
      const row = this.rows[y]

      if (direction === 'right') {
        if (row.glyphs[x + 1]) {
          this.selection = {
            x: x + 1,
            y,
          }
        } else if (this.rows[y + 1]) {
          this.selection = {
            x: 0,
            y: y + 1,
          }
        }
      } else if (direction === 'left') {
        if (row.glyphs[x - 1]) {
          this.selection = {
            x: x - 1,
            y,
          }
        } else if (this.rows[y - 1]) {
          this.selection = {
            x: this.rows[y - 1].glyphs.length - 1,
            y: y - 1,
          }
        }
      } else if (direction === 'down') {
        const newRow = this.rows[y + 1]
        if (newRow && newRow.glyphs[x]) {
          this.selection = {
            x,
            y: y + 1,
          }
        } else if (newRow) {
          this.selection = {
            x: newRow.glyphs.length - 1,
            y: y + 1,
          }
        }
      } else if (direction === 'up') {
        const newRow = this.rows[y - 1]
        if (newRow && newRow.glyphs[x]) {
          this.selection = {
            x,
            y: y - 1,
          }
        } else if (newRow) {
          this.selection = {
            x: newRow.glyphs.length - 1,
            y: y - 1,
          }
        }
      }

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
      setSelection: this.setSelection,
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
      glyphRowWithTitleHeight: {
        enumerable: true,
        get: () => this.glyphRowWithTitleHeight,
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
