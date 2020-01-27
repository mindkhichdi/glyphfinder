<template>
  <div class="glyph-list">
    <virtual-list
      :scrollelement="scrollelement"
      :start="navigatable.startRow"
      :size="navigatable.rowHeight"
      :variable="getVariableHeight"
      :remain="navigatable.showRows"
      :item="rowComponent"
      :itemcount="rowsCount"
      :itemprops="getItemProps"
      :onscroll="onScroll"
    />
  </div>
</template>

<script>
import collect from 'collect.js'
import VirtualList from 'vue-virtual-scroll-list'
import GlyphRow from '@/components/GlyphRow'
import Store from '@/services/Store'

export default {
  inject: ['navigatable'],

  components: {
    VirtualList,
  },

  props: {
    glyphs: {
      type: Array,
      default: () => ([]),
    },
  },

  data() {
    return {
      rowComponent: GlyphRow,
      scrollelement: null,
      usage: Store.get('usage', []),
    }
  },

  computed: {
    rowsCount() {
      return this.rows.length
    },

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
  },

  methods: {
    chunkGlyphs(glyphs) {
      return collect(glyphs)
        .chunk(this.navigatable.itemsPerRow)
        .filter(items => items.toArray().length)
        .map(items => ({
          glyphs: items.toArray(),
        }))
        .toArray()
    },

    getVariableHeight(index) {
      return this.rows[index].title
        ? this.navigatable.titleRowHeight
        : this.navigatable.rowHeight
    },

    getItemProps(index) {
      return {
        props: this.rows[index],
      }
    },

    onScroll(event, data) {
      this.navigatable.handleScroll(data)
    },
  },

  mounted() {
    this.scrollelement = this.$el
  },
}
</script>

<style lang="scss" src="./style.scss" scoped></style>
