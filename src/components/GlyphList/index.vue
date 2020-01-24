<template>
  <div class="glyph-list">
    <virtual-list
      :scrollelement="scrollelement"
      :start="navigatable.startRow"
      :size="navigatable.rowHeight"
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
      return collect(this.glyphs)
        .chunk(this.navigatable.itemsPerRow)
        .toArray()
    },
  },

  methods: {
    getItemProps(itemIndex) {
      return {
        props: {
          glyphs: this.rows[itemIndex],
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
