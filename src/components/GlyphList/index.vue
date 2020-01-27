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
    }
  },

  computed: {
    rowsCount() {
      return this.rows.length
    },

    rows() {
      const glyphRows = collect(this.glyphs)
        .chunk(this.navigatable.itemsPerRow)
        .map(glyphs => ({
          glyphs: glyphs.toArray(),
        }))
        .toArray()

      return [
        {
          title: 'Frequently used',
        },
        {
          title: 'Glyphs',
        },
        ...glyphRows,
      ]
    },
  },

  methods: {
    getVariableHeight(index) {
      return this.rows[index].title
        ? this.navigatable.titleRowHeight
        : this.navigatable.rowHeight
    },

    getItemProps(index) {
      return {
        props: {
          title: this.rows[index].title,
          glyphs: this.rows[index].glyphs,
        },
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
