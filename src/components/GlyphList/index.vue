<template>
  <div class="glyph-list">
    <virtual-list
      :start="navigatable.startRow"
      :size="50"
      :remain="navigatable.showRows"
      :item="rowComponent"
      :itemcount="rowsCount"
      :itemprops="getItemProps"
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
  },
}
</script>
