<script>
import collect from 'collect.js'
import Store from '@/services/Store'

export default {
  props: {
    glyphs: {
      type: Array,
      default: () => ([]),
    },

    showFrequentlyUsedGlyphs: {
      type: Boolean,
      default: true,
    },
  },

  data() {
    return {
      selection: {
        x: 0,
        y: 0,
      },
      element: null,
      showRows: 8,
      itemsPerRow: 5,
      glyphRowHeight: 62,
      glyphRowWithTitleHeight: 92,
      firstFullyVisibleRowIndex: 0,
      lastFullyVisibleRowIndex: 0,
      isExpanded: Store.get('expanded', false),
      expandedHeight: 101,
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
      if (!this.showFrequentlyUsedGlyphs) {
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
        .map((row, index, array) => {
          if (index === 0 && this.hasFrequentlyUsedGlyphs) {
            return {
              ...row,
              title: 'Glyphs',
              height: this.glyphRowWithTitleHeight,
            }
          }

          if (index === array.length - 1) {
            return {
              height: this.glyphRowHeight + this.expandedHeight + 20,
              ...row,
            }
          }

          return {
            height: this.glyphRowHeight,
            ...row,
          }
        })
    },

    frequentlyUsedGlyphRows() {
      return this.chunkGlyphs(this.frequentlyUsedGlyphs)
        .map((row, index) => {
          if (index === 0) {
            return {
              ...row,
              title: 'Frequently used',
              height: this.glyphRowWithTitleHeight,
            }
          }

          return {
            height: this.glyphRowHeight,
            ...row,
          }
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
        const size = row.height

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
        this.maybeUpdateScrollPosition()
      },
    },
  },

  methods: {
    setElement(element) {
      this.element = element
    },

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
      const visibleScrollHeight = containerHeight - (this.isExpanded ? this.expandedHeight : 54)
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

    maybeUpdateScrollPosition() {
      const { y } = this.selection

      if (!this.offsets[y]) {
        return
      }

      if (y < this.firstFullyVisibleRowIndex || y > this.lastFullyVisibleRowIndex) {
        this.element.scrollTop = this.offsets[y].offset
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

      if (!row) {
        return
      }

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

      this.maybeUpdateScrollPosition()
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
      setElement: this.setElement,
      setSelection: this.setSelection,
      handleScroll: this.handleScroll,
      toggleExpand: this.toggleExpand,
    }

    Object.defineProperties(navigatable, {
      rows: {
        enumerable: true,
        get: () => this.rows,
      },
      selectedGlyph: {
        enumerable: true,
        get: () => this.selectedGlyph,
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
      rows: this.rows,
      selectedGlyph: this.selectedGlyph,
    })
  },
}
</script>
